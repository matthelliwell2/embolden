import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {StitchControlComponent} from './stitch-control.component'

describe('StitchControlComponent', () => {
  let component: StitchControlComponent;
  let fixture: ComponentFixture<StitchControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StitchControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StitchControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
