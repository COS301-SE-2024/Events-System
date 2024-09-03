import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalenderComponent } from './calender.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // Import FullCalendar module
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('CalenderComponent', () => {
  let component: CalenderComponent;
  let fixture: ComponentFixture<CalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalenderComponent, FullCalendarModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the calendar when calendarVisible is true', () => {
    component.calendarVisible.set(true);
    fixture.detectChanges();
    const calendarElement = fixture.debugElement.query(By.css('full-calendar'));
    expect(calendarElement).toBeTruthy();
  });

});
