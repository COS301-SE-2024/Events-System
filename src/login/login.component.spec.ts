import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LoginComponent } from './login.component'; // Import EventComponent

// Mock component
@Component({
  selector: 'app-mock-login',
  template: '',
})
class MockEventComponent {/*...*/}

@Component({
  template: '<app-mock-login></app-mock-login>', // Use the correct selector
})
class TestHostComponent {/*...*/}

describe('LoginComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent], // Move EventComponent to imports
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