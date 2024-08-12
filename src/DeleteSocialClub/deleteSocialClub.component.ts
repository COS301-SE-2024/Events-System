import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-delete-social-club',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './deleteSocialClub.component.html',
  styleUrl: './deleteSocialClub.component.css',
})
export class DeleteSocialClubComponent {
  @Input() clubName: string | undefined;

  deleteForm: FormGroup;
  clubID = '';
  formName = '';
  isAPILoading = false;
  showsuccessToast = false;
  showfailToast = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  )
  {
    this.deleteForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

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
      
      if(this.deleteForm.valid) {
        this.isAPILoading = true;
        this.formName = this.deleteForm.get('name')?.value
        
        if(this.formName.toLowerCase() === this.clubName?.toLowerCase()) {
          fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs/' + this.clubID, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: '{}'
          })
          .then(data => {
            this.showsuccessToast = true;
            this.isAPILoading = false;

            setTimeout(() => {
              this.showsuccessToast = false;
              window.history.back();
              // this.router.navigate(['/socialclublisting']);
            }, 5000);
          })
          .catch ((error) => {
            this.showfailToast = true;
            this.isAPILoading = false;

            setTimeout(() => {
              this.showfailToast = false;
            }, 10000);
            console.error('Error:', error);
          });
        }
        else
        {
          this.showfailToast = true;
          this.isAPILoading = false;

          setTimeout(() => {
            this.showfailToast = false;
          }, 10000);
          console.error("Incorrect club name")
        }
      }
      else {
        this.showfailToast = true;
        this.isAPILoading = false;

        setTimeout(() => {
          this.showfailToast = false;
        }, 10000);
        console.error("Please enter a name")
      }
    });
  }
}
