import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialClubCreateComponent } from './socialClubCreate.component';

describe('SocialClubCreateComponent', () => {
  let component: SocialClubCreateComponent;
  let fixture: ComponentFixture<SocialClubCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialClubCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialClubCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
