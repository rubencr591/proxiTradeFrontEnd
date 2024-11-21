import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { Conversation } from '../model/conversation';
import { Image } from '../model/image';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {

  private baseUrl =  environment.urlBackend +"api/conversations"; 

  private conversations: Conversation[] = [];

  public conversations$: Subject<Conversation[]>;

  private selectedConversation: Conversation = null;


  constructor(private http: HttpClient) { 
    this.conversations$ = new Subject<Conversation[]>();
  }

  getConversationById(id: number): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.baseUrl}/${id}`);
  }

  getConversationObs(): Observable<Conversation[]> {
    return this.conversations$.asObservable();
  }

  setConversations(conversations: Conversation[]) {
    this.conversations = conversations;
    this.conversations$.next(this.conversations);
  }

  getSelectedConversation(): Conversation {
    return this.selectedConversation;
  }

  setSelectedConversation(conversation: Conversation) {
    this.selectedConversation = conversation;
  }


  createConversation(targetUserId: string): Observable<Conversation> {
    const url = `${this.baseUrl}/create/${targetUserId}`;
  
  
    // Realiza la solicitud POST con los parámetros
    return this.http.post<Conversation>(url, {}).pipe(
      map((newConversation: any) => {
        const conversation = new Conversation( newConversation.user1.uid, newConversation.user2.uid);
        conversation.setTitle(newConversation.title);
        conversation.setId(newConversation.id);
        conversation.setPicture(this.formatImageBase64(newConversation.picture));

        return conversation;
      })
    );
  }
  
  

  updateConversation(id: number, conversation: Conversation): Observable<Conversation> {
    return this.http.put<Conversation>(`${this.baseUrl}/${id}`, conversation);
  }

  deleteConversation(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  async getAllConversationsByUserId(){
    const url = `${this.baseUrl}/user`;
     this.http.get<any[]>(url).pipe(
      map((conversations: any[]) => {
        let formattedConversations: Conversation[] = [];
        conversations.forEach(newConversation => {
          const conversation = new Conversation(newConversation.user1.uid, newConversation.user2.uid);
          conversation.setId(newConversation.id);
          conversation.setTitle(newConversation.title);
          conversation.setPicture(this.formatImageBase64(newConversation.picture));
          formattedConversations.push(conversation);
        });
        return formattedConversations;
      })
    ).subscribe((conversations) => {
      this.conversations = conversations;
      this.conversations$.next(this.conversations);
    });
  }


  formatImageBase64(image: string): string {
    const extension = Image.detectImageExtension(image);
    if (extension) {
      return `data:image/${extension};base64,${image}`;
    }
    return null;
  }
    

}
