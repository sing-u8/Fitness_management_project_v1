import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmissionHistoryDetailModalComponent } from './transmission-history-detail-modal.component';

describe('TransmissionHistoryDetailModalComponent', () => {
  let component: TransmissionHistoryDetailModalComponent;
  let fixture: ComponentFixture<TransmissionHistoryDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransmissionHistoryDetailModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmissionHistoryDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
