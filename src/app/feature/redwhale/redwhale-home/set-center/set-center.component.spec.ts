import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCenterComponent } from './set-center.component';

describe('SetCenterComponent', () => {
  let component: SetCenterComponent;
  let fixture: ComponentFixture<SetCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
