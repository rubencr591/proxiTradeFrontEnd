import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-my-sold-products',
  templateUrl: './my-sold-products.page.html',
  styleUrls: ['./my-sold-products.page.scss'],
})
export class MySoldProductsPage implements OnInit {

  soldProducts:any[];
  constructor(private transactionService:TransactionService) { }

  ngOnInit() {
    this.transactionService.getMySoldProducts().subscribe((products) => {
      this.soldProducts = products;
    });
  }

}
