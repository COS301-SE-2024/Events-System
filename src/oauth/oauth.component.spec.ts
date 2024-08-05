import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OauthComponent } from './oauth.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Component } from '@angular/core';

@Component({
  selector: 'app-mock-app-oauth',
  template: '',
})
class MockEventComponent {}

@Component({
  template: '<app-mock-app-oauth></app-mock-app-oauth>',
})
class TestHostComponent {}

describe('OauthComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthComponent],
      declarations: [TestHostComponent, MockEventComponent],
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
