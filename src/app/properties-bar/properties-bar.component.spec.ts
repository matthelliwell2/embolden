import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {PropertiesBarComponent} from './properties-bar.component'

describe('PropertiesBarComponent', () => {
  let component: PropertiesBarComponent;
  let fixture: ComponentFixture<PropertiesBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertiesBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
