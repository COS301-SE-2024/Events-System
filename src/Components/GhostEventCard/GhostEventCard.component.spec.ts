import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GhostEventCardComponent } from './GhostEventCard.component';

describe('GhostEventCardComponent', () => {
  let component: GhostEventCardComponent;
  let fixture: ComponentFixture<GhostEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GhostEventCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GhostEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
