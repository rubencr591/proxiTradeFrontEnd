import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { EditProfilePictureComponent } from 'src/app/components/edit-profile-picture/edit-profile-picture.component';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  myUser: User = new User('', '', '', '', null);
  userProducts: any[] = [];
  loading: any;
  firstTime = true;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private productService: ProductService,
    private loadingController: LoadingController
  ) {
    this.productService.getMyProductsObs().subscribe((products) => {
      this.userProducts = products;
      this.firstTime = false;
      if (this.loading) {
        this.loading.dismiss();
      }
    });
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  ionViewDidEnter() {
    if (!this.firstTime) {
      this.getUserInfo();
    }
  }

  selectProduct(product) {
    const encodedProductInfo = btoa(`${product.id};${true}`);
    this.router.navigate(['/product-details', encodedProductInfo]);
    }

  async getProducts() {
    this.loading = await this.loadingController.create({
      message: 'Loading...',
    });
    await this.loading.present();
    this.productService.getProductsByUser();
  }

  async createProduct() {
    this.router.navigate(['/create-product']);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [
        {
          text: 'Delete the profile picture',
          role: 'destructive',
          handler: () => {
            this.deleteProfilePicture();
          }
        },
        {
          text: 'Edit the profile picture',
          handler: () => {
            this.openEditProfileModal();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async openEditProfileModal() {
    const modal = await this.modalController.create({
      component: EditProfilePictureComponent
    });
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.saveProfilePicture(result.data);
      }
    });
    await modal.present();
  }

  async saveProfilePicture(base64Image: string) {
    this.userService.updateProfilePicture(base64Image).subscribe((success) => {
      if (success) {
        this.getUserInfo();
      }
    });
  }

  async deleteProfilePicture() {
    this.userService.updateProfilePicture(null).subscribe((success) => {
      if (success) {
        this.getUserInfo();
      }
    });
  }

  async getUserInfo() {
    this.userService.getCurrentUserInfo().subscribe((user) => {
      this.myUser = user;
      this.getProducts();
    });
  }

  async logout() {
    try {
      await this.authService.logout().then((success) => {
        if (success) {
          this.router.navigate(['/login']);
        }
      });
    } catch (error) {
    }
  }

  editProfile() {

    this.router.navigate(['/edit-profile']);
  }

  updateAddress() {

    this.router.navigate(['/address', {edit:true} ]);
  }

  navigateToMyPurchasedProducts() {
    this.router.navigate(['/my-purchased-products']);
  }

  navigateToMySoldProducts() {
    this.router.navigate(['/my-sold-products']);
  }
}
