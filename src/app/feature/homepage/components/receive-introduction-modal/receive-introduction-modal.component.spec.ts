import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveIntroductionModalComponent } from './receive-introduction-modal.component';

describe('ReceiveIntroductionModalComponent', () => {
  let component: ReceiveIntroductionModalComponent;
  let fixture: ComponentFixture<ReceiveIntroductionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveIntroductionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveIntroductionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
