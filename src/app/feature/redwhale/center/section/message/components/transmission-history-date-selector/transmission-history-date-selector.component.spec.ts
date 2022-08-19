import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmissionHistoryDateSelectorComponent } from './transmission-history-date-selector.component';

describe('TransmissionHistoryDateSelectorComponent', () => {
  let component: TransmissionHistoryDateSelectorComponent;
  let fixture: ComponentFixture<TransmissionHistoryDateSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransmissionHistoryDateSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmissionHistoryDateSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
