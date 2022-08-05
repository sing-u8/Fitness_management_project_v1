import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailContractItemComponent } from './user-detail-contract-item.component';

describe('UserDetailContractItemComponent', () => {
  let component: UserDetailContractItemComponent;
  let fixture: ComponentFixture<UserDetailContractItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailContractItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailContractItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
