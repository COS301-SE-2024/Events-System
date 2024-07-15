import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteSocialClubComponent } from './deleteSocialClub.component';

describe('DeleteSocialClubComponent', () => {
  let component: DeleteSocialClubComponent;
  let fixture: ComponentFixture<DeleteSocialClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSocialClubComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteSocialClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
