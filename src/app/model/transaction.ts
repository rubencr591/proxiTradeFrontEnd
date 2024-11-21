export class Transaction{
    userBuyerName: string;
    userSellerName: string;
    productName: string;
    amount: number;
    type: string;

    constructor(userBuyerName: string, userSellerName:string, productName: string, amount: number, type: string){
        this.userBuyerName = userBuyerName;
        this.userSellerName = userSellerName;
        this.productName = productName;
        this.amount = amount;
        this.type = type;
    }
    
}