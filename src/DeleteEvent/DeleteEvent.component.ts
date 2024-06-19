import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private route: ActivatedRoute, private location: Location) { }  
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
}