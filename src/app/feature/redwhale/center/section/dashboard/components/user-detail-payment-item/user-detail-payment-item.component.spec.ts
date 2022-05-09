import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailPaymentItemComponent } from './user-detail-payment-item.component';

describe('UserDetailPaymentItemComponent', () => {
  let component: UserDetailPaymentItemComponent;
  let fixture: ComponentFixture<UserDetailPaymentItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailPaymentItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailPaymentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
