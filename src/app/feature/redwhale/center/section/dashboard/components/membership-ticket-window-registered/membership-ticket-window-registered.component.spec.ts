import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipTicketWindowRegisteredComponent } from './membership-ticket-window-registered.component';

describe('MembershipTicketWindowRegisteredComponent', () => {
  let component: MembershipTicketWindowRegisteredComponent;
  let fixture: ComponentFixture<MembershipTicketWindowRegisteredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipTicketWindowRegisteredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipTicketWindowRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
