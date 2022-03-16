import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeStartModalComponent } from './free-start-modal.component';

describe('FreeStartModalComponent', () => {
  let component: FreeStartModalComponent;
  let fixture: ComponentFixture<FreeStartModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeStartModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeStartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
