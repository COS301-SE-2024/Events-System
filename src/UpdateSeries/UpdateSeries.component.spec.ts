import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { UpdateSeriesComponent } from './UpdateSeries.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('UpdateSeriesComponent', () => {
  let component: UpdateSeriesComponent;
  let fixture: ComponentFixture<UpdateSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule,UpdateSeriesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'testId' })
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update sessionStorage when input fields change', () => {
    const nameInput = fixture.debugElement.query(By.css('input[placeholder="Type here"]')).nativeElement;
    nameInput.value = 'Test Series';
    nameInput.dispatchEvent(new Event('input'));
    expect(sessionStorage.getItem('Name')).toBe('Test Series');

    const descriptionInput = fixture.debugElement.query(By.css('textarea[placeholder="Bio"]')).nativeElement;
    descriptionInput.value = 'Test Description';
    descriptionInput.dispatchEvent(new Event('input'));
    expect(sessionStorage.getItem('Description')).toBe('Test Description');
  });
});
