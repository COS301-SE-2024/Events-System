import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SocialClubListingComponent } from './socialClubListing.component'; // Import SocialClubListingComponent

// Mock component
@Component({
  selector: 'app-mock-social-club-listing', // Change this to a unique selector
  template: '',
})
class MockEventComponent {/*...*/}

@Component({
  template: '<app-mock-social-club-listing></app-mock-social-club-listing>', // Use the new selector
})
class TestHostComponent {/*...*/}

describe('EventComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialClubListingComponent], // Move EventComponent to imports
      declarations: [TestHostComponent, MockEventComponent], // Remove EventComponent from declarations
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'testId' }) // Add your own mock values here
          }
        }
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});