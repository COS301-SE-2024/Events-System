import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GhostSearchClubCardComponent } from './GhostSearchClubCard.component';

describe('GhostSearchClubCardComponent', () => {
  let component: GhostSearchClubCardComponent;
  let fixture: ComponentFixture<GhostSearchClubCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GhostSearchClubCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GhostSearchClubCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
