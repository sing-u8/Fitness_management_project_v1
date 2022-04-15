import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsPrivacyPageComponent } from './terms-privacy-page.component';

describe('TermsPrivacyPageComponent', () => {
  let component: TermsPrivacyPageComponent;
  let fixture: ComponentFixture<TermsPrivacyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsPrivacyPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsPrivacyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
