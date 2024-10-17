import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SocialClubComponent } from './socialClub.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SocialClubComponent', () => {
  let component: SocialClubComponent;
  let fixture: ComponentFixture<SocialClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialClubComponent],
      declarations: [],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'testId' }),
            queryParams: of({ startTour: 'true' })
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display skeleton content when loading', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const skeletonElements = fixture.debugElement.queryAll(By.css('.skeleton'));
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('should display actual content when not loading and club is defined', () => {
    component.isLoading = false;
    component.club = {
      name: 'Test Club',
      summaryDescription: 'Test Summary',
      ownerID: 'owner123'
    };
    component.ownerName = 'John';
    component.ownerSurname = 'Doe';
    fixture.detectChanges();

    const clubNameElement = fixture.debugElement.query(By.css('h1')).nativeElement;

    expect(clubNameElement.textContent).toContain('Test Club');

  });
});