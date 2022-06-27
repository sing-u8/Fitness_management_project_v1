import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchPadComponent } from './touch-pad.component';

describe('TouchPadComponent', () => {
  let component: TouchPadComponent;
  let fixture: ComponentFixture<TouchPadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchPadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchPadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
