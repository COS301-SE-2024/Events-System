import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttendedEventCardComponent } from './attendedEventCard.component';

describe('AttendedEventCardComponent', () => {
  let component: AttendedEventCardComponent;
  let fixture: ComponentFixture<AttendedEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendedEventCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttendedEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
