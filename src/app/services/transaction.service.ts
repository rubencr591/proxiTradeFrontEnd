import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../model/transaction';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private baseUrl = environment.urlBackend + 'api/transactions';

  constructor( private http:HttpClient) { }


   // Método para obtener los productos comprados por el usuario
   getMyPurchasedProducts(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/my-purchased-products`);
  }

  // Método para obtener los productos vendidos por el usuario
  getMySoldProducts(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/my-sold-products`);
  }

  // Método para crear una nueva transacción
  createTransaction(userSellerUid:string,productId:number, amount:number, type:string ): Observable<any> {

    const transaction = {
      userSellerUid,
      productId,
      amount,
      type
    }


    return this.http.post<any>(`${this.baseUrl}`, transaction);
  }
}
