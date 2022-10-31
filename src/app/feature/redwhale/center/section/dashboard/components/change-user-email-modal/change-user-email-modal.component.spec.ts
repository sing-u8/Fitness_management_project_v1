import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUserEmailModalComponent } from './change-user-email-modal.component';

describe('ChangeUserEmailModalComponent', () => {
  let component: ChangeUserEmailModalComponent;
  let fixture: ComponentFixture<ChangeUserEmailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeUserEmailModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeUserEmailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
