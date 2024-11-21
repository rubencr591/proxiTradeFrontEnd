import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-my-purchased-products',
  templateUrl: './my-purchased-products.page.html',
  styleUrls: ['./my-purchased-products.page.scss'],
})
export class MyPurchasedProductsPage implements OnInit {

  purchasedProducts:any[];

  constructor(private transactionService:TransactionService) { }

  ngOnInit() {
    this.transactionService.getMyPurchasedProducts().subscribe((products) => {
      this.purchasedProducts = products;
    });
  }

}
