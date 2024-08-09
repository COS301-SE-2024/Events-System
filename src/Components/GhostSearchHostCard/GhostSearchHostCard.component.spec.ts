import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GhostSearchHostCardComponent } from './GhostSearchHostCard.component';

describe('GhostSearchHostCardComponent', () => {
  let component: GhostSearchHostCardComponent;
  let fixture: ComponentFixture<GhostSearchHostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GhostSearchHostCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GhostSearchHostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
