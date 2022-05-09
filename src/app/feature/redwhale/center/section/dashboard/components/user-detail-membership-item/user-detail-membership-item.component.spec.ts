import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailMembershipItemComponent } from './user-detail-membership-item.component';

describe('UserDetailMembershipItemComponent', () => {
  let component: UserDetailMembershipItemComponent;
  let fixture: ComponentFixture<UserDetailMembershipItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailMembershipItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailMembershipItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
