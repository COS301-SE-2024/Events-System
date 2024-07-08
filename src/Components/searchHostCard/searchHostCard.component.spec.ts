import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchHostCardComponent } from './searchHostCard.component';

describe('SearchHostCardComponent', () => {
  let component: SearchHostCardComponent;
  let fixture: ComponentFixture<SearchHostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchHostCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchHostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
