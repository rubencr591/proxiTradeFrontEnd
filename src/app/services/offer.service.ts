import { Injectable } from '@angular/core';
import { Product } from '../model/product';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  private selectedProduct: Product;
  private selectedProductID: number;
  private offerAmount: number;

  constructor() {}

  setSelectedProduct(product: any) {
    this.selectedProduct = product;
  }

  getSelectedProduct() {
    return this.selectedProduct;
  }
  
  setSelectedProductID(productId: number, offerAmount:number) {
    this.selectedProductID = productId;
    this.offerAmount = offerAmount;
  }

  getOffer(){
    return { productId: this.selectedProductID, offerAmount: this.offerAmount};
  }


}

