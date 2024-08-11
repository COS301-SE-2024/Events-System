import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-delete-series',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './DeleteSeries.component.html',
  styleUrl: './DeleteSeries.component.css',
})
export class DeleteSeriesComponent {
  isAPILoading = false;
  showsuccessToast = false;
  showfailToast = false;
  @ViewChild('nameInput') nameInput!: ElementRef;
  seriesId= '';
  myseries: any = {};
  constructor(private route: ActivatedRoute, private location: Location) { }  
  goBack(): void {
    window.history.back();
  }
  presubmit(){
    console.log(this.nameInput.nativeElement.value);
    console.log(this.myseries.title);
    if(this.nameInput.nativeElement.value === '' || this.nameInput.nativeElement.value !== this.myseries.name){
      alert('Please enter the correct event name');
      return;
    }else{
      this.submit();
    }
  }
  submit(){
    this.isAPILoading = true; // Set isLoading to true at the start of the method

      fetch(`https://events-system-back.wn.r.appspot.com/api/eventseries/${this.seriesId}`, {
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
      this.seriesId = params['id'];

      fetch('https://events-system-back.wn.r.appspot.com/api/eventseries/' + this.seriesId)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.myseries = data;
      });


    });
  }
}
