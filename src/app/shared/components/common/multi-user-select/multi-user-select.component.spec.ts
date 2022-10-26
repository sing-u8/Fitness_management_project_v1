import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiUserSelectComponent } from './multi-user-select.component';

describe('MultiUserSelectComponent', () => {
  let component: MultiUserSelectComponent;
  let fixture: ComponentFixture<MultiUserSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiUserSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiUserSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
