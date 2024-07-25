import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventRatingsComponent } from './eventRatings.component';

describe('EventRatingsComponent', () => {
  let component: EventRatingsComponent;
  let fixture: ComponentFixture<EventRatingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventRatingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
