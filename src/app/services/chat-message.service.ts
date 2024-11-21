import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Message } from '../model/message';
import { combineLatest, map, Observable } from 'rxjs';
import { Offert } from '../model/offert';
import { MessageOrOffer } from '../pages/tab2/tab2.page';


@Injectable({
  providedIn: 'root'
})

export class ChatService {
  constructor(private db: AngularFireDatabase) {}


  async sendMessage(senderId: string, receiverId: string, message: string) {
    const timestamp = Date.now();
    const newMessage = new Message(senderId, receiverId, message, timestamp);
    const messageRef = this.db.list(`messages/${newMessage.senderId}_${newMessage.receiverId}`).push(newMessage);
    return messageRef.then(ref => {
      // Guardar el ID del mensaje
      return ref.update({ id: ref.key });
    });
  }

  async sendOffer(senderId: string, receiverId: string, productID:number, message: string, offerPrice: number) {
    const timestamp = Date.now();
    const newOffer = new Offert(senderId, receiverId,productID, message, timestamp, offerPrice);
    const offerRef = this.db.list(`messages/${newOffer.senderId}_${newOffer.receiverId}`).push(newOffer);
    return offerRef.then(ref => {
      // Guardar el ID de la oferta
      return ref.update({ id: ref.key });
    });
  }

  getMessages(senderId: string, receiverId: string): Observable<MessageOrOffer[]> {
    const messages1$ = this.db.list<MessageOrOffer>(`messages/${senderId}_${receiverId}`).valueChanges();
    const messages2$ = this.db.list<MessageOrOffer>(`messages/${receiverId}_${senderId}`).valueChanges();
  
    return combineLatest([messages1$, messages2$]).pipe(
      map(([messages1, messages2]) => {
        const combinedMessages = [...messages1, ...messages2];
        return combinedMessages.sort((a, b) => a.timestamp - b.timestamp); // Ordena los mensajes por su marca de tiempo
      })
    );
  }



  async deleteConversation(senderId: string, receiverId: string): Promise<void> {
    const conversationPath1 = `messages/${senderId}_${receiverId}`;
    const conversationPath2 = `messages/${receiverId}_${senderId}`;
    
    // Borra los mensajes de la conversación desde ambas direcciones
    const deleteMessages1 = this.db.list<Message>(conversationPath1).remove();
    const deleteMessages2 = this.db.list<Message>(conversationPath2).remove();
    
    // Espera a que ambas operaciones de eliminación se completen
    try {
      await Promise.all([deleteMessages1, deleteMessages2]);
    } catch (error) {
    }
  }


  async deleteMessage(senderId: string, receiverId: string, messageId: string): Promise<void> {
    const messagePath1 = `messages/${senderId}_${receiverId}/${messageId}`;
    const messagePath2 = `messages/${receiverId}_${senderId}/${messageId}`;
    
    // Eliminar el mensaje de ambas direcciones
    const deleteMessage1 = this.db.object(messagePath1).remove();
    const deleteMessage2 = this.db.object(messagePath2).remove();
    
    try {
      await Promise.all([deleteMessage1, deleteMessage2]);
    } catch (error) {
    }
  }
  
}