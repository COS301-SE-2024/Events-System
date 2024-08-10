import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DeleteEventComponent } from './DeleteEvent.component';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('DeleteEventComponent', () => {
  let component: DeleteEventComponent;
  let fixture: ComponentFixture<DeleteEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, NoopAnimationsModule, DeleteEventComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '8' }) // Mock route params
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change state when delete button is clicked', () => {
    const deleteButton = fixture.debugElement.query(By.css('button.btn-error'));
    expect(deleteButton).toBeTruthy();
    deleteButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    // Check if the state has changed as expected
    // Example: expect(component.someState).toBe(expectedValue);
  });

  it('should show loading toast when isAPILoading is true', () => {
    component.isAPILoading = true;
    fixture.detectChanges();
    const loadingToast = fixture.debugElement.query(By.css('.toast .alert-info'));
    expect(loadingToast).toBeTruthy();
  });

  it('should show success toast when showsuccessToast is true', () => {
    component.showsuccessToast = true;
    fixture.detectChanges();
    const successToast = fixture.debugElement.query(By.css('.toast .alert-success'));
    expect(successToast).toBeTruthy();
  });

  it('should show fail toast when showfailToast is true', () => {
    component.showfailToast = true;
    fixture.detectChanges();
    const failToast = fixture.debugElement.query(By.css('.toast .alert-error'));
    expect(failToast).toBeTruthy();
  });
});
