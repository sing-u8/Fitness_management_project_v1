import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeStartFooterComponent } from './free-start-footer.component';

describe('FreeStartFooterComponent', () => {
  let component: FreeStartFooterComponent;
  let fixture: ComponentFixture<FreeStartFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeStartFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeStartFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
