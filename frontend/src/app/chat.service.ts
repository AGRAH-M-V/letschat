import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';

export interface Message {
  id?: string;
  username: string;
  content: string;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private client: Client;
  private messageSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messageSubject.asObservable();
  private messages: Message[] = [];
  
  constructor(private http: HttpClient) {
    this.client = new Client({
      brokerURL: `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      this.client.subscribe('/topic/public', (message) => {
        if (message.body) {
          const msg: Message = JSON.parse(message.body);
          this.messages.push(msg);
          this.messageSubject.next([...this.messages]);
        }
      });
    };
  }

  loadInitialMessages() {
    this.http.get<Message[]>('/api/messages').subscribe(msgs => {
      this.messages = msgs;
      this.messageSubject.next([...this.messages]);
    });
  }

  connect() {
    this.client.activate();
  }

  disconnect() {
    this.client.deactivate();
  }

  sendMessage(message: Message) {
    this.client.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(message)
    });
  }
}
