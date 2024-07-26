import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventFeedbackComponent } from './eventFeedback.component';

describe('EventFeedbackComponent', () => {
  let component: EventFeedbackComponent;
  let fixture: ComponentFixture<EventFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFeedbackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
