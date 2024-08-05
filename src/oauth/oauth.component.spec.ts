import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OauthComponent } from './oauth.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('OauthComponent', () => {
  let component: OauthComponent;
  let fixture: ComponentFixture<OauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ code: 'testCode'})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
