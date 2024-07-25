import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-notif-popup',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notif-popup.component.html',
  styleUrls: ['./notif-popup.component.css'],
})
export class NotifPopupComponent{
    
        notifications = [
          { id: 1, title: 'Notification Title 1',  read: false },
          { id: 2, title: 'Notification Title 2',  read: false },
          { id: 3, title: 'Notification Title 3',  read: false },
        ];
      
        selectedNotification: any = null;
      
        constructor(private router: Router) {}
      
        ngOnInit(): void {}
      
        markAllAsRead(): void {
          this.notifications.forEach(notification => notification.read = true);
        }
      
        clearAll(): void {
          this.notifications = [];
        }
      
        markAsRead(event: MouseEvent, notificationId: number): void {
          event.stopPropagation(); // Prevents the click from bubbling up to the notification card
          const notification = this.notifications.find(n => n.id === notificationId);
          if (notification) {
            notification.read = true;
          }
        }
        
      
        openPopover(notification: any): void {
          this.selectedNotification = notification;
        }
      
        closePopover(): void {
          this.selectedNotification = null;
        }
      }
      

