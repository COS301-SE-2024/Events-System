import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreLoginComponent } from './pre-login.component';

describe('PreLoginComponent', () => {
  let component: PreLoginComponent;
  let fixture: ComponentFixture<PreLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreLoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
