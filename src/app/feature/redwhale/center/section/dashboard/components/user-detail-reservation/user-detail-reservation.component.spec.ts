import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailReservationComponent } from './user-detail-reservation.component';

describe('UserDetailReservationComponent', () => {
  let component: UserDetailReservationComponent;
  let fixture: ComponentFixture<UserDetailReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailReservationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
