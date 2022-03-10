import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionBoxComponent } from './function-box.component';

describe('FunctionBoxComponent', () => {
  let component: FunctionBoxComponent;
  let fixture: ComponentFixture<FunctionBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunctionBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
