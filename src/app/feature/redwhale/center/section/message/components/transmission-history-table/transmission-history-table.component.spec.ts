import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmissionHistoryTableComponent } from './transmission-history-table.component';

describe('TransmissionHistoryTableComponent', () => {
  let component: TransmissionHistoryTableComponent;
  let fixture: ComponentFixture<TransmissionHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransmissionHistoryTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmissionHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
