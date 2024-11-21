import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ProductService } from './product.service';
import { TransactionService } from './transaction.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private transactionService:TransactionService) { }

  processPayment(paymentInfo:any, userSellerUid:string,productId:number,totalAmount:number): Observable<boolean> {

    // Simulate payment
    // If payment is successful, create a transaction
    // If transaction is successful, return true
    // If transaction fails, return false
    return this.transactionService.createTransaction(userSellerUid,productId, totalAmount, paymentInfo.method).pipe(
      map(() => {
        return true;
      }),
      catchError(() => {
        return of(false);
      })
    );





  }
}
