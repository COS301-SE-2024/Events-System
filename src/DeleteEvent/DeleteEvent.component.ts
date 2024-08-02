import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-delete-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './DeleteEvent.component.html',
  styleUrl: './DeleteEvent.component.css',
})
export class DeleteEventComponent {
  isAPILoading = false;
  showsuccessToast = false;
  showfailToast = false;
  @ViewChild('nameInput') nameInput!: ElementRef;
  eventId= '';
  myevent: any = {};
  constructor(private route: ActivatedRoute, private location: Location, private notificationService: NotificationService) { }  
  goBack(): void {
    window.history.back();
  }
  presubmit(){
    if(this.nameInput.nativeElement.value === '' || this.nameInput.nativeElement.value !== this.myevent.title){
      alert('Please enter the correct event name');
      return;
    }else{
      this.submit();
    }
  }
  submit(){
    this.isAPILoading = true; // Set isLoading to true at the start of the method

      fetch(`https://events-system-back.wn.r.appspot.com/api/events/${this.eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{}'
      })
      .then(() => {
        // Show the success toast
        this.showsuccessToast = true;
        this.notify();
        this.isAPILoading = false;
        // Hide the toast after 5 seconds
        setTimeout(() => {
          this.showsuccessToast = false;
          window.history.back();
        }, 5000);
      })
      .catch((error) => {
        this.showfailToast = true;
        this.isAPILoading = false;
        setTimeout(() => {
          this.showfailToast = false;
        }, 10000);
        console.error('Error:', error);
      });
}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = params['id'];

      fetch('https://events-system-back.wn.r.appspot.com/api/events/' + this.eventId)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.myevent = data;
      });


    });
  }

  notify() {
    const eventName = this.myevent.title ?? 'Unknown';
    this.notificationService.sendNotification(Number(localStorage.getItem('ID')), Number(this.eventId), "Event Deleted", eventName).subscribe(response => {
      console.log(response); // Handle the response as needed
    });
  }
}