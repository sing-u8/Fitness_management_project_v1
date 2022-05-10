import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockerExtensionModalComponent } from './locker-extension-modal.component';

describe('LockerExtensionModalComponent', () => {
  let component: LockerExtensionModalComponent;
  let fixture: ComponentFixture<LockerExtensionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockerExtensionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LockerExtensionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
