export class Message {
    id: string;
    senderId: string;
    receiverId: string;
    message: string;
    timestamp: number;

    constructor(senderId: string, receiverId: string, message: string, timestamp: number) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.message = message;
        this.timestamp = timestamp;
    }
}