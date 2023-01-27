import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeTryFooterComponent } from './free-try-footer.component';

describe('FreeTryFooterComponent', () => {
  let component: FreeTryFooterComponent;
  let fixture: ComponentFixture<FreeTryFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeTryFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeTryFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
