import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SocialClubsComponent } from './SocialClubs.component'; // Import SocialClubsComponent

// Mock component
@Component({
  selector: 'app-mock-social-clubs',
  template: '',
})
class MockEventComponent {/*...*/}

@Component({
  template: '<app-mock-social-clubs></app-mock-social-clubs>', // Use the correct selector
})
class TestHostComponent {/*...*/}

describe('EventComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialClubsComponent], // Move EventComponent to imports
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