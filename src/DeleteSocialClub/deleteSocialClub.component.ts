import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-social-club',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deleteSocialClub.component.html',
  styleUrl: './deleteSocialClub.component.css',
})
export class DeleteSocialClubComponent {
  @Input() clubName: string | undefined;

  clubID = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute
  )
  {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {   // Get the event ID from the URL
      this.clubID = params['id'];
      
      fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs/' + this.clubID)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.clubName = data.name;
      })
    })
}

  deleteClub() {
    this.route.params.subscribe(params => {   // Get the event ID from the URL
      this.clubID = params['id'];

      try {
        fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs/' + this.clubID, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: '{}'
        })
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          console.log("Delete successful");
        })
      }
      catch (error) {
        console.error('Error:', error);
        console.error('Error during deletion:', error);
      }
      
      this.router.navigate(['/socialclublisting']);
    });
  }
}
