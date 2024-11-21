import { Message } from "./message";

export class Offert extends Message{

    offerPrice: number;
    productId: number;

    constructor(senderId: string, receiverId: string, productId:number, message: string, timestamp: number, offerPrice: number){
        super(senderId, receiverId, message, timestamp);
        this.productId = productId;
        this.offerPrice = offerPrice;
    }
}