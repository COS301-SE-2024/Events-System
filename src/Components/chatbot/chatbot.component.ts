import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogflowService } from '../../app/dialogflow.service';
import { v4 as uuidv4 } from 'uuid';
import { RouterModule } from '@angular/router';
import { ChatbotEventCardComponent } from '../chatbotEventCard/chatbotEventCard.component';
interface Message {
  text: string;
  isUser: boolean;
  isEvent?: boolean;
  eventData?: any;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, RouterModule, ChatbotEventCardComponent],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements OnInit {
  @ViewChild('chatContent') chatContent!: ElementRef;

  messages: Message[] = [];
  events: any[] = [];
  sessionId = "";
  userID = 0;
  typing = false;
  imageSource = "";
  isOpen = false;

  constructor(private dialogflowService: DialogflowService) {}

  ngOnInit(): void {
    this.sessionId = uuidv4();
    // Add initial bot message
    this.messages.push({ text: "Hi! How can I help?", isUser: false });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(message: string): void {
    const userID = Number(localStorage.getItem('ID'));
    this.messages.push({ text: message, isUser: true });
    this.typing = true; // Set typing to true
    this.scrollToBottom(); // Scroll to bottom after user sends a message
    this.dialogflowService.detectIntent(message, this.sessionId, userID).then(response => {
      this.handleResponse(response);
      this.typing = false; // Set typing to false
    }).catch(error => {
      console.error('Error:', error);
      this.typing = false; // Set typing to false
    });
  }

  async handleResponse(response: string): Promise<void> {
      const helpMessageFirstLine = "Here are the things I can help you with:";
      const prepareKeyword = "prepare";
      const agendaKeyword = "agenda";
      if (response.startsWith(helpMessageFirstLine)) {
          const helpMessages = response.split('\n');
          for (const helpMessage of helpMessages) {
              if (helpMessage.trim()) {
                  this.messages.push({ text: helpMessage.trim(), isUser: false });
              }
          }
          return;
      }
  

      

      if (response.includes(prepareKeyword)) {
        const [firstLine, ...preparationDetails] = response.split('\n');
        this.messages.push({ text: firstLine, isUser: false });
        preparationDetails.forEach(detail => {
            const cleanedDetail = detail.replace(/^- /, '').trim(); // Remove leading hyphens and trim
            this.messages.push({ text: `o ${cleanedDetail}`, isUser: false });
        });
        return;
    }

    if (response.includes(agendaKeyword)) {
      const [firstLine, ...agendaDetails] = response.split('\n');
      this.messages.push({ text: firstLine, isUser: false });
      agendaDetails.forEach(detail => {
          const cleanedDetail = detail.replace(/^- /, '').trim(); // Remove leading hyphens and trim
          this.messages.push({ text: `o ${cleanedDetail}`, isUser: false });
      });
      return;
  }



      const eventPattern = /Title:\s*(.*?),\s*Location:\s*(.*?),\s*Start Date:\s*(\d{4}-\d{2}-\d{2}),\s*Start Time:\s*(\d{2}:\d{2}:\d{2})/g;
      let match;
      const events = [];
      const uniqueEvents = new Set<string>();
  
      // Extract multiple events
      while ((match = eventPattern.exec(response)) !== null) {
          const eventIdentifier = `${match[1]}_${match[3]}_${match[4]}`;
          if (!uniqueEvents.has(eventIdentifier)) {
              uniqueEvents.add(eventIdentifier);
              events.push({
                  title: match[1],
                  location: match[2],
                  startDate: match[3],
                  startTime: match[4]
              });
          }
      }
  
      if (events.length > 0) {
          const responseText = response.replace(eventPattern, '').trim();
          if (responseText) {
              this.messages.push({ text: responseText, isUser: false });
          }
  
          for (const event of events) {
              this.messages.push({
                  text: `Event: ${event.title}`,
                  isUser: false,
                  isEvent: true,
                  eventData: event
              });
          }
      } else {
          this.messages.push({ text: response, isUser: false });
      }
  }
  
  async fetchEventData(eventId: number): Promise<any> {
    try {
      const eventResponse = await fetch('https://events-system-back.wn.r.appspot.com/api/events/' + eventId);
      const eventData = await eventResponse.json();
      eventData.startTime = this.formatTime(eventData.startTime);
      eventData.endTime = this.formatTime(eventData.endTime);
      return eventData;
    } catch (error) {
      console.error('Error fetching event data:', error);
      return null;
    }
  }

  formatTime(time: string): string {
    const date = new Date(time);
    return date.toLocaleTimeString();
  }

  isUserMessage(index: number): boolean {
    return this.messages[index].isUser;
  }

  isEventMessage(text: string): boolean {
    return /^\d+\.\d+$/.test(text);
  }

  scrollToBottom(): void {
    try {
      this.chatContent.nativeElement.scrollTop = this.chatContent.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll to bottom failed:', err);
    }
  }
}