import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SocialClubComponent } from './socialClub.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Component, Input } from '@angular/core';

// Mock component for testing
@Component({
  selector: 'app-mock-event',
  template: '<div class="mock-event"></div>',
})
class MockEventComponent {
  @Input() eventId!: string;
}

describe('SocialClubComponent', () => {
  let component: SocialClubComponent;
  let fixture: ComponentFixture<SocialClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockEventComponent],
      imports: [SocialClubComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'testId' }),
          },
        },
      ],
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
    component.club = { name: 'Test Club', description: 'Test Description' };
    component.imageSource = 'test-image.jpg';
    fixture.detectChanges();

    const heroElement = fixture.debugElement.query(By.css('.hero'));
    expect(heroElement).toBeTruthy();

    const clubNameElement = fixture.debugElement.query(By.css('h1'));
    expect(clubNameElement.nativeElement.textContent).toContain('Test Club');

    const clubDescriptionElement = fixture.debugElement.query(By.css('h2'));
    expect(clubDescriptionElement.nativeElement.textContent).toContain('Test Description');
  });

  it('should switch tabs when tab is clicked', () => {
    component.isLoading = false;
    component.club = { name: 'Test Club', description: 'Test Description' };
    fixture.detectChanges();

    const tab1 = fixture.debugElement.query(By.css('a[role="tab"]:nth-child(1)'));
    const tab2 = fixture.debugElement.query(By.css('a[role="tab"]:nth-child(2)'));

    tab2.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.activeTab).toBe('tab2');

    tab1.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.activeTab).toBe('tab1');
  });
});
