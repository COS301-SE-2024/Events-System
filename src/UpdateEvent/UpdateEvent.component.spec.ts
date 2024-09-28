import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UpdateEventComponent } from './UpdateEvent.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
describe('UpdateEventComponent', () => {
  let component: UpdateEventComponent;
  let fixture: ComponentFixture<UpdateEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, UpdateEventComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }),
            snapshot: { paramMap: { get: () => '123' } }
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update sessionStorage when input fields change', () => {
    const nameInput = fixture.debugElement.query(By.css('input[placeholder="Type here"]')).nativeElement;
    nameInput.value = 'Test Event';
    nameInput.dispatchEvent(new Event('input'));
    expect(sessionStorage.getItem('uName')).toBe('Test Event');

    const descriptionInput = fixture.debugElement.query(By.css('textarea[placeholder="Bio"]')).nativeElement;
    descriptionInput.value = 'Test Description';
    descriptionInput.dispatchEvent(new Event('input'));
    expect(sessionStorage.getItem('uDescription')).toBe('Test Description');

    const startTimeInput = fixture.debugElement.query(By.css('input[type="time"]')).nativeElement;
    startTimeInput.value = '10:00';
    startTimeInput.dispatchEvent(new Event('input'));
    expect(sessionStorage.getItem('uStartTime')).toBe('10:00');

    const endTimeInput = fixture.debugElement.queryAll(By.css('input[type="time"]'))[1].nativeElement;
    endTimeInput.value = '12:00';
    endTimeInput.dispatchEvent(new Event('input'));
    expect(sessionStorage.getItem('uEndTime')).toBe('12:00');

    const startDateInput = fixture.debugElement.query(By.css('input[type="date"]')).nativeElement;
    startDateInput.value = '2023-10-01';
    startDateInput.dispatchEvent(new Event('input'));
    expect(sessionStorage.getItem('uStartDate')).toBe('2023-10-01');

    const endDateInput = fixture.debugElement.queryAll(By.css('input[type="date"]'))[1].nativeElement;
    endDateInput.value = '2023-10-02';
    endDateInput.dispatchEvent(new Event('input'));
    expect(sessionStorage.getItem('uEndDate')).toBe('2023-10-02');

  });

});
