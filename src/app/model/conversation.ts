
export class Conversation {
    id: number;
    title: string;
    userId1: string;
    userId2: string;
    picture: string;

    constructor( userId1: string, userId2: string) {
        this.userId1 = userId1;
        this.userId2 = userId2;
    }

    setId(id: number){
        this.id = id;
    }

    setTitle(title: string){
        this.title = title;
    }

    setPicture(picture: string){
        this.picture = picture;
    }
}