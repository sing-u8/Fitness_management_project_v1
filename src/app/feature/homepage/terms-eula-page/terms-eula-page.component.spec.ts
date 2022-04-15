import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsEulaPageComponent } from './terms-eula-page.component';

describe('TermsEulaPageComponent', () => {
  let component: TermsEulaPageComponent;
  let fixture: ComponentFixture<TermsEulaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsEulaPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsEulaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
