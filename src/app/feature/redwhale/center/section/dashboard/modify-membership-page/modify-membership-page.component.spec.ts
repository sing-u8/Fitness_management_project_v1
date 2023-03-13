import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyMembershipPageComponent } from './modify-membership-page.component';

describe('ModifyMembershipPageComponent', () => {
  let component: ModifyMembershipPageComponent;
  let fixture: ComponentFixture<ModifyMembershipPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyMembershipPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyMembershipPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
