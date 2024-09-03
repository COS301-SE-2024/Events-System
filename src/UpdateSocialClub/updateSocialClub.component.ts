import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { RandomImageServiceService } from 'src/app/random-image-service.service';

@Component({
  selector: 'app-update-social-club',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './updateSocialClub.component.html',
  styleUrl: './updateSocialClub.component.css',
})

export class UpdateSocialClubComponent implements OnInit{
  clubID = '';
  imageSource: string;
  updateForm: FormGroup;
  isAPILoading = false;
  showsuccessToast = false;
  showfailToast = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private randomImageService: RandomImageServiceService
  )
  {
    this.updateForm = this.fb.group({
      name: [],
      description: [],
      pictureLink: [],
      summaryDescription: [],
      categories: []
    });
    this.imageSource = '';
  }

  ngOnInit(): void{
    this.isAPILoading = true;
    this.imageSource = this.randomImageService.getRandomImageSource();

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
          this.updateForm.setValue({
            name: data.name,
            description: data.description,
            pictureLink: data.pictureLink || "assets/pexels-rahulp9800-1652361.jpg",
            summaryDescription: data.summaryDescription,
            categories: data.categories
          });

          this.isAPILoading = false;
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
      catch (error)
      {
        this.showfailToast = true;
        this.isAPILoading = false;

        setTimeout(() => {
          this.showfailToast = false;
        }, 10000);
        console.error('Error:', error);
      }
    });
  }
  
  async updateClub() {
    this.isAPILoading = true;

      this.route.params.subscribe(params => {   // Get the event ID from the URL
    
        this.clubID = params['id'];
        const formData = {
          name: this.updateForm.get('name')?.value,
          description: this.updateForm.get('description')?.value,
          pictureLink: this.updateForm.get('pictureLink')?.value,
          summaryDescription: this.updateForm.get('summaryDescription')?.value,
          categories: [this.updateForm.get('categories')?.value]
        };
        // console.log("Form data: " + formData);
        
        try{
          fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs/' + this.clubID, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
          .then(() => {
            // Show the success toast
            this.showsuccessToast = true;
            this.isAPILoading = false;

            setTimeout(() => {
              this.showsuccessToast = false;
              window.history.back();
              // this.router.navigate(['/socialclublisting']);
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
        catch (error) {
          this.showfailToast = true;
          this.isAPILoading = false;

          setTimeout(() => {
            this.showfailToast = false;
          }, 10000);
          console.error('Error:', error);
        }
      }
    );
  }
}
