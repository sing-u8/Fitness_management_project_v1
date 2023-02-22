import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeTrialModalComponent } from './free-trial-modal.component';

describe('FreeTrialModalComponent', () => {
  let component: FreeTrialModalComponent;
  let fixture: ComponentFixture<FreeTrialModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeTrialModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeTrialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
