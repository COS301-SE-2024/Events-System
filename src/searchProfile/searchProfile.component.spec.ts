import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchProfileComponent } from './searchProfile.component';

describe('SearchProfileComponent', () => {
  let component: SearchProfileComponent;
  let fixture: ComponentFixture<SearchProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
