import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PorfolioComponent } from './porfolio.component';

describe('PorfolioComponent', () => {
  let component: PorfolioComponent;
  let fixture: ComponentFixture<PorfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PorfolioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PorfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
