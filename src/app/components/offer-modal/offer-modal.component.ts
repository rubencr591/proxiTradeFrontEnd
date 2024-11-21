import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Product } from 'src/app/model/product';
import { OfferService } from 'src/app/services/offer.service';

@Component({
  selector: 'app-offer-modal',
  templateUrl: './offer-modal.component.html',
  styleUrls: ['./offer-modal.component.scss'],
})
export class OfferModalComponent  {

  product: Product;
  offerPrice: number;

  constructor(private modalController: ModalController,private offerService:OfferService) {
    this.product  = this.offerService.getSelectedProduct();
  }

  dismiss() {
    this.offerService.setSelectedProduct(null);
    this.modalController.dismiss();
  }

  sendOffer() {

    this.offerService.setSelectedProduct(null);

    this.modalController.dismiss({
      product: this.product,
      offerPrice: this.offerPrice
    });
  }
}
