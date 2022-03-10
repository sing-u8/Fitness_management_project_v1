import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindMoreButtonComponent } from './find-more-button.component';

describe('FindMoreButtonComponent', () => {
  let component: FindMoreButtonComponent;
  let fixture: ComponentFixture<FindMoreButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindMoreButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindMoreButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
