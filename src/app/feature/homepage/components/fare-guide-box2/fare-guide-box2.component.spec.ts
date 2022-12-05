import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FareGuideBox2Component } from './fare-guide-box2.component';

describe('FareGuideBox2Component', () => {
  let component: FareGuideBox2Component;
  let fixture: ComponentFixture<FareGuideBox2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FareGuideBox2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FareGuideBox2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
