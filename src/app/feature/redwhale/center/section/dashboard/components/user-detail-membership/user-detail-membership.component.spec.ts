import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailMembershipComponent } from './user-detail-membership.component';

describe('UserDetailMembershipComponent', () => {
  let component: UserDetailMembershipComponent;
  let fixture: ComponentFixture<UserDetailMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailMembershipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
