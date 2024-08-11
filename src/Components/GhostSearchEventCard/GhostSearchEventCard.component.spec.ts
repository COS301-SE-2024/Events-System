import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GhostSearchEventCardComponent } from './GhostSearchEventCard.component';

describe('GhostSearchEventCardComponent', () => {
  let component: GhostSearchEventCardComponent;
  let fixture: ComponentFixture<GhostSearchEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GhostSearchEventCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GhostSearchEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
