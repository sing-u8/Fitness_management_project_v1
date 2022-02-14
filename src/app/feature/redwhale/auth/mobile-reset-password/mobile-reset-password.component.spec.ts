import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileResetPasswordComponent } from './mobile-reset-password.component';

describe('MobileResetPasswordComponent', () => {
  let component: MobileResetPasswordComponent;
  let fixture: ComponentFixture<MobileResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileResetPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
