import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';
import { ProductService } from 'src/app/services/product.service';
import { OfferService } from 'src/app/services/offer.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.page.html',
  styleUrls: ['./payment-method.page.scss'],
})
export class PaymentMethodPage implements OnInit {
  paymentForm: FormGroup;
  productId: any;
  totalAmount: number;
  product: any = {
    id: 0,
    name: '',
    description: '',
    category: { id: -1, name: '' },
    salePrice: 0,
    latitude: 0,
    longitude: 0,
    availability: false,
    productOwnerId: '',
    images: [],
  }
  shippingCost: number = 5; 
  offer: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private paymentService: PaymentService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private offerService: OfferService
  ) { }

  ngOnInit() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId');

    if(this.productId != null){
    this.getProduct();
    }else{
      this.offer = this.offerService.getOffer();
      this.productId = this.offer.productId;
      this.getProduct();
    }

    this.paymentForm = this.fb.group({
      method: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, this.validateCardNumber]],
      cardExpiry: ['', [Validators.required, this.validateCardExpiry]],
      cardCVC: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  validateCardNumber(control) {
    const visaPattern = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const mastercardPattern = /^5[1-5][0-9]{14}$/;
    const amexPattern = /^3[47][0-9]{13}$/;
    const discoverPattern = /^6(?:011|5[0-9]{2})[0-9]{12}$/;

    if (visaPattern.test(control.value) || mastercardPattern.test(control.value) || amexPattern.test(control.value) || discoverPattern.test(control.value)) {
      return null;
    } else {
      return { 'invalidCardNumber': true };
    }
  }

  validateCardExpiry(control) {
    const value = control.value;
    if (value.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      const [month, year] = value.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      if (+year > currentYear || (+year === currentYear && +month >= currentMonth)) {
        return null;
      }
    }
    return { 'invalidExpiryDate': true };
  }

  async getProduct(){

     this.productService.getProductById(this.productId).subscribe(async (product) => {
      this.product = product;
      if(this.product.availability == false){
        const alert = await this.alertCtrl.create({
          header: 'Product not available',
          message: 'The product you are trying to purchase is not available. Please try again later.',
          buttons: ['OK']
        });
        await alert.present();

        this.router.navigate(['/tabs']);
      }
      if(this.offer){
        this.product.salePrice = this.offer.offerAmount;
      }
      this.totalAmount = this.product.salePrice + this.shippingCost;

    });
  }

  async proceedToPayment() {


    const loading = await this.loadingController.create({
      message: 'Processing payment...',
    });
    await loading.present();

     this.paymentService.processPayment(this.paymentForm.value, this.product.productOwnerId, this.productId,this.totalAmount).subscribe(async (success) => {
      if (success) {

        const alert = await this.alertCtrl.create({
          header: 'Payment successful',
          message: 'Your payment was successful. Thank you for shopping with us!',
          buttons: ['OK']
        });
        await alert.present();

        this.router.navigate(['/tabs']);
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Payment failed',
          message: 'Your payment was not successful. Please try again.',
          buttons: ['OK']
        });
        await alert.present();
      }
      loading.dismiss();

    });
  }
}
