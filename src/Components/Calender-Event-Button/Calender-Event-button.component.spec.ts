import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalenderEventButtonComponent } from './Calender-Event-button.component';

describe('CalenderEventButtonComponent', () => {
  let component: CalenderEventButtonComponent;
  let fixture: ComponentFixture<CalenderEventButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalenderEventButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalenderEventButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
