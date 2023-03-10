import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMembershipLockerPageComponent } from './register-membership-locker-page.component';

describe('RegisterMembershipLockerPageComponent', () => {
  let component: RegisterMembershipLockerPageComponent;
  let fixture: ComponentFixture<RegisterMembershipLockerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterMembershipLockerPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterMembershipLockerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
