import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailLockerItemComponent } from './user-detail-locker-item.component';

describe('UserDetailLockerItemComponent', () => {
  let component: UserDetailLockerItemComponent;
  let fixture: ComponentFixture<UserDetailLockerItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailLockerItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailLockerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
