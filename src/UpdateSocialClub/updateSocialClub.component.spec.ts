import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateSocialClubComponent } from './updateSocialClub.component';

describe('UpdateSocialClubComponent', () => {
  let component: UpdateSocialClubComponent;
  let fixture: ComponentFixture<UpdateSocialClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSocialClubComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateSocialClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
