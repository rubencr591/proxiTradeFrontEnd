import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { OfferModalComponent } from 'src/app/components/offer-modal/offer-modal.component';
import { UserListModalComponent } from 'src/app/components/user-list-modal/user-list-modal.component';
import { Conversation } from 'src/app/model/conversation';
import { Message } from 'src/app/model/message';
import { Offert } from 'src/app/model/offert';
import { Product } from 'src/app/model/product';
import { ChatService } from 'src/app/services/chat-message.service';
import { ConversationsService } from 'src/app/services/conversations.service';
import { OfferService } from 'src/app/services/offer.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { Router } from '@angular/router';

export interface MessageOrOffer extends Message, Offert {}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer: ElementRef;

  conversations: Conversation[] = [];
  currentUserId: string;
  selectedConversation: Conversation;
  conversationMessages: MessageOrOffer[] = [];
  messageText: string = "";
  receiverId: string = "";
  loading: any;
  subscriptions: Subscription[] = [];

  constructor(
    private conversationService: ConversationsService,
    private chatService: ChatService,
    private userService: UserService, 
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private offerService:OfferService,
    private alertController:AlertController,
    private router:Router
  ) {}

  ngOnInit(): void {

    this.subscriptions.push(
      this.conversationService.getConversationObs().subscribe((conversations: any) => {
        this.conversations = conversations;
        if (this.offerService.getSelectedProduct() != null) {
          this.createConversationWithUID(this.offerService.getSelectedProduct().productOwnerId);
        }
        if(this.loading){
          this.loading.dismiss();
        }
      })
    );
  }

  async getUserInfo(){
    this.userService.getCurrentUserInfo().subscribe((user: User) => {
      this.currentUserId = user.getUID();
    });
  }

  async ionViewWillEnter() {
    this.getUserInfo();
    this.selectedConversation = this.conversationService.getSelectedConversation();

    this.conversationMessages = [];
    this.conversations = [];

    if(this.selectedConversation){
      this.selectConversation(this.selectedConversation);
    }

  
    await this.conversationService.getAllConversationsByUserId();

    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  scrollToBottom() {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  isOfferMessage(message: MessageOrOffer): boolean {
    return message.offerPrice != null;
  }
  
  async selectConversation(conversation: Conversation) {
    this.scrollToBottom();

    this.receiverId = conversation.userId1 === this.currentUserId
      ? conversation.userId2
      : conversation.userId1;
    
    this.conversationService.setSelectedConversation(conversation);

    this.selectedConversation = conversation;

    await this.getMessagesByConversation();
  }

  async getMessagesByConversation() {
    this.loading = await this.loadingController.create({
      message: 'Loading messages...'
    });
    await this.loading.present();
    this.conversationMessages = [];
    this.scrollToBottom();

    this.subscriptions.push(
      this.chatService.getMessages(this.currentUserId, this.receiverId).subscribe({
        next: (messages: MessageOrOffer[]) => {
          this.conversationMessages = messages;
          if(this.loading){
            this.loading.dismiss();
          }
          setTimeout(() => {
            this.scrollToBottom();
          }, 100);
        },
        error: () => {
          if(this.loading){
            this.loading.dismiss();
          }
        }
      })
    );
  }

  async selectUser() {
    const modal = await this.modalCtrl.create({
      component: UserListModalComponent
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    const userSelected = data;

    if (userSelected) {
      const existingConversation = this.conversations.find(conversation => conversation.userId2 === userSelected.uid);
      if (existingConversation) {
        this.toastController.create({
          message: 'You already have a conversation with this user',
          duration: 2000
        }).then(toast => toast.present());
       await this.selectConversation(existingConversation);
        return;
      } else {
        await this.createConversation(userSelected.uid);
      }
    }
  }

  async createConversationWithUID(uid: string) {
    const existingConversation = this.conversations.find(conversation => 
      (conversation.userId1 === this.currentUserId && conversation.userId2 === uid) ||
      (conversation.userId1 === uid && conversation.userId2 === this.currentUserId)
    );

    const alert = await this.alertController.create({
      header: 'Start an offer conversation?',
      message: 'Do you want to start a conversation to make an offer?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.offerService.setSelectedProduct(null);
          }
        }, {
          text: 'Accept',
          handler: () => {
            this.modalCtrl.create({
              component: OfferModalComponent
            }).then(modal => {
              modal.present();

              modal.onDidDismiss().then((data) => {
                if (data.data) {
                  this.sendOffer(data.data.product, data.data.offerPrice);
                }
              });
            });
          }
        }
      ]
    });
  
    if (existingConversation) {
      await this.selectConversation(existingConversation);
    } else {
      await this.createConversation(uid);
    }

    await alert.present();
  }

  async createConversation(userSelectedUid:string){
    this.conversationService.createConversation(userSelectedUid).subscribe((conversation: Conversation) => {
      this.conversations.push(conversation);
      this.selectConversation(conversation);
    });
  }

  async deleteConversation(conversation: Conversation) {
    this.conversationService.deleteConversation(conversation.id).subscribe(() => {
      this.chatService.deleteConversation(this.currentUserId, this.receiverId).then(() => {
        this.conversations = this.conversations.filter(conversationItem => conversationItem.id !== conversation.id);
        this.selectedConversation = null;
        this.conversationMessages = [];
      });
    });
  }

  async sendOffer(product: Product, offerPrice: number) {
    await this.chatService.sendOffer(this.currentUserId, this.receiverId, product.id, "Offer for product: " + product.name, offerPrice);
  }

  sendMessage() {
    if (this.messageText != "") {
      this.chatService.sendMessage(this.currentUserId, this.receiverId, this.messageText).then(() => {
        this.messageText = "";
        this.scrollToBottom();
      });
    }
  }

  acceptOffer(offer: Offert) {
    this.conversationMessages = this.conversationMessages.filter(message => message !== offer);
    this.chatService.deleteMessage(this.currentUserId, this.receiverId, offer.id).then(() => {
    });

    this.offerService.setSelectedProduct(null);

    this.offerService.setSelectedProductID(offer.productId, offer.offerPrice);

    this.router.navigate(['/payment-method' ]);
    

  }

  rejectOffer(offer: Offert) {
    this.conversationMessages = this.conversationMessages.filter(message => message !== offer);
    this.chatService.deleteMessage(this.currentUserId, this.receiverId, offer.id).then(() => {
    });
  }
}
