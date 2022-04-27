import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMemberModalComponent } from './register-member-modal.component';

describe('RegisterMemberModalComponent', () => {
  let component: RegisterMemberModalComponent;
  let fixture: ComponentFixture<RegisterMemberModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterMemberModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterMemberModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
