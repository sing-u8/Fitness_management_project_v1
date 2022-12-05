import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FareGuideOptionTable2Component } from './fare-guide-option-table2.component';

describe('FareGuideOptionTable2Component', () => {
  let component: FareGuideOptionTable2Component;
  let fixture: ComponentFixture<FareGuideOptionTable2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FareGuideOptionTable2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FareGuideOptionTable2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
