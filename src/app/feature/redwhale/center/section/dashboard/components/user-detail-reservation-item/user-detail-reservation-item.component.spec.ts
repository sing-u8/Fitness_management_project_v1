import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailReservationItemComponent } from './user-detail-reservation-item.component';

describe('UserDetailReservationItemComponent', () => {
  let component: UserDetailReservationItemComponent;
  let fixture: ComponentFixture<UserDetailReservationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailReservationItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailReservationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
