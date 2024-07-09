import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchSocialClubCardComponent } from './searchSocialClubCard.component';

describe('SearchSocialClubCardComponent', () => {
  let component: SearchSocialClubCardComponent;
  let fixture: ComponentFixture<SearchSocialClubCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSocialClubCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchSocialClubCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
