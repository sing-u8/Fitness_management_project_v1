import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferMembershipTicketWindowComponent } from './transfer-membership-ticket-window.component';

describe('TransferMembershipTicketWindowComponent', () => {
  let component: TransferMembershipTicketWindowComponent;
  let fixture: ComponentFixture<TransferMembershipTicketWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferMembershipTicketWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferMembershipTicketWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
