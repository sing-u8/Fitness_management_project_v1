import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentToastComponent } from './component-toast.component';

describe('ComponentToastComponent', () => {
  let component: ComponentToastComponent;
  let fixture: ComponentFixture<ComponentToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentToastComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
