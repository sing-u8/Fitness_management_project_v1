import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmissionHistoryItemComponent } from './transmission-history-item.component';

describe('TransmissionHistoryItemComponent', () => {
  let component: TransmissionHistoryItemComponent;
  let fixture: ComponentFixture<TransmissionHistoryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransmissionHistoryItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmissionHistoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
