import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailLockerComponent } from './user-detail-locker.component';

describe('UserDetailLockerComponent', () => {
  let component: UserDetailLockerComponent;
  let fixture: ComponentFixture<UserDetailLockerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailLockerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailLockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
