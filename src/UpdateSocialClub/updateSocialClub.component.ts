import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule, HttpClient  } from '@angular/common/http';

@Component({
  selector: 'app-update-social-club',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './updateSocialClub.component.html',
  styleUrl: './updateSocialClub.component.css',
})

export class UpdateSocialClubComponent implements OnInit{
  clubID = '';
  updateForm: FormGroup;
  isLoading = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient
  )
  {
    this.updateForm = this.fb.group({
      name: [],
      description: [],
      pictureLink: [],
      summaryDescription: [],
      categories: []
    });
  }

  ngOnInit(): void{
    this.isLoading = true;

    this.route.params.subscribe(params => {   // Get the event ID from the URL
      this.clubID = params['id'];
      console.log('ID: ' + this.clubID);

      try {
        fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs/' + this.clubID, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => {
            // Show the success toast
            console.log(data);
            this.updateForm.setValue({
              name: data.name,
              description: data.description,
              pictureLink: data.pictureLink,
              summaryDescription: data.summaryDescription,
              categories: data.categories
            });
            this.isLoading = false;
        });
      }
      catch (error)
      {
        console.error('Error:', error);
        console.error('Error during login:', error);
      }
    });
  }
  
  async updateClub() {
    
    if (this.updateForm.valid) {
      this.route.params.subscribe(params => {   // Get the event ID from the URL
    
        this.clubID = params['id'];
        const formData = {
          name: this.updateForm.get('name')?.value,
          description: this.updateForm.get('description')?.value,
          pictureLink: this.updateForm.get('pictureLink')?.value,
          summaryDescription: this.updateForm.get('summaryDescription')?.value,
          categories: this.updateForm.get('categories')?.value
        };
        console.log("Form data: " + formData);
        
        try{
          fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs/' + this.clubID, {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
          .then(response => response.json())
          .then(data => {
              // Show the success toast
              console.log(data);
          });
        }
        catch (error)
        {
          console.error('Error:', error);
          console.error('Error during login:', error);
        }
      }
    )};

    this.router.navigate(['/socialclublisting']);
  }
}
