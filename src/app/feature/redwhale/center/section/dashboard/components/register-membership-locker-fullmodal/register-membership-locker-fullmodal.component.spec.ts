import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMembershipLockerFullmodalComponent } from './register-membership-locker-fullmodal.component';

describe('RegisterMembershipLockerFullmodalComponent', () => {
  let component: RegisterMembershipLockerFullmodalComponent;
  let fixture: ComponentFixture<RegisterMembershipLockerFullmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterMembershipLockerFullmodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterMembershipLockerFullmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
