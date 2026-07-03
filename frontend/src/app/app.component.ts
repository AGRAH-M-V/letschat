import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, Message } from './chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  username: string = '';
  newMessageContent: string = '';
  messages: Message[] = [];

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.username = 'User_' + Math.floor(Math.random() * 10000);
    this.chatService.loadInitialMessages();
    this.chatService.connect();
    
    this.chatService.messages$.subscribe(msgs => {
      this.messages = msgs;
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }

  sendMessage() {
    if (this.newMessageContent.trim()) {
      const msg: Message = {
        username: this.username,
        content: this.newMessageContent
      };
      this.chatService.sendMessage(msg);
      this.newMessageContent = '';
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
