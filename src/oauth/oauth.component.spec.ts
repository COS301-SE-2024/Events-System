import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OauthComponent } from './oauth.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Component } from '@angular/core';

@Component({
  selector: 'app-mock-app-event',
  template: '',
})
class MockEventComponent {}

@Component({
  template: '<app-mock-app-event></app-mock-app-event>',
})
class TestOauthComponent {}

describe('OauthComponent', () => {
  let component: TestOauthComponent;
  let fixture: ComponentFixture<OauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthComponent],
      declarations: [TestOauthComponent, MockEventComponent],
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
