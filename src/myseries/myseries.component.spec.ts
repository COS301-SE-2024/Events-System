import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MyseriesComponent } from './myseries.component';

@Component({
  selector: 'app-myseriescard',
  template: ''
})
class MockMyseriesCardComponent {
  @Input() seriesId!: string;
  @Input() name!: string;
}

describe('MyseriesComponent', () => {
  let component: MyseriesComponent;
  let fixture: ComponentFixture<MyseriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MyseriesComponent], // Import RouterTestingModule and the standalone component
      declarations: [MockMyseriesCardComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyseriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the create series button', () => {
    const createButton = fixture.debugElement.query(By.css('.btn-outline.btn-primary'));
    expect(createButton).toBeTruthy();
  });



  it('should display series cards', () => {
    component.series = [
      { seriesId: '1', name: 'Series 1' },
      { seriesId: '2', name: 'Series 2' }
    ];
    fixture.detectChanges();
    const seriesCards = fixture.debugElement.queryAll(By.css('app-myseriescard'));
    expect(seriesCards.length).toBe(2);
  });

  it('should pass the correct inputs to series cards', () => {
    component.series = [
      { seriesId: '1', name: 'Series 1' },
      { seriesId: '2', name: 'Series 2' }
    ];
    fixture.detectChanges();
    const seriesCards = fixture.debugElement.queryAll(By.css('app-myseriescard'));
    expect(seriesCards[0].componentInstance.seriesId).toBe('1');
    expect(seriesCards[0].componentInstance.name).toBe('Series 1');
    expect(seriesCards[1].componentInstance.seriesId).toBe('2');
    expect(seriesCards[1].componentInstance.name).toBe('Series 2');
  });
});
