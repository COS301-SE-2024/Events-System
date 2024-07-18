import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule, HttpClient  } from '@angular/common/http';

@Component({
  selector: 'app-update-social-club',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './updateSocialClub.component.html',
  styleUrl: './updateSocialClub.component.css',
})

export class UpdateSocialClubComponent {
  updateForm: FormGroup;
  isAPILoading = false;
  constructor(
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

  async updateClub() {
    this.isAPILoading = true;

    if (!this.updateForm.valid) {
      console.log("yes");
      const formData = {
        name: this.updateForm.get('name')?.value,
        description: this.updateForm.get('description')?.value,
        pictureLink: this.updateForm.get('pictureLink')?.value,
        summaryDescription: this.updateForm.get('summaryDescription')?.value,
        categories: this.updateForm.get('categories')?.value
      };
      console.log(formData);
      try{
        fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs/1', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
      .then(response => response.json())
      .then(data => {
          // Show the success toast
        console.log(data);
      });}
      catch (error)
      {
        console.error('Error:', error);
        console.error('Error during login:', error);
      }
    }
  }
}
