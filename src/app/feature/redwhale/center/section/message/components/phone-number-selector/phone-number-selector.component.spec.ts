import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneNumberSelectorComponent } from './phone-number-selector.component';

describe('PhoneNumberSelectorComponent', () => {
  let component: PhoneNumberSelectorComponent;
  let fixture: ComponentFixture<PhoneNumberSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneNumberSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneNumberSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
