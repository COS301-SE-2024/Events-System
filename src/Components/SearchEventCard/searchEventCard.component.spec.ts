import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchEventCardComponent } from './searchEventCard.component';

describe('SearchEventCardComponent', () => {
  let component: SearchEventCardComponent;
  let fixture: ComponentFixture<SearchEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchEventCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
