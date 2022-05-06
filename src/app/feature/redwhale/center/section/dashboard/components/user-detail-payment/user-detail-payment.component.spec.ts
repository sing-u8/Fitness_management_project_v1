import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailPaymentComponent } from './user-detail-payment.component';

describe('UserDetailPaymentComponent', () => {
  let component: UserDetailPaymentComponent;
  let fixture: ComponentFixture<UserDetailPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
