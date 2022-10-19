import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailItemRemoveModalComponent } from './detail-item-remove-modal.component';

describe('DetailItemRemoveModalComponent', () => {
  let component: DetailItemRemoveModalComponent;
  let fixture: ComponentFixture<DetailItemRemoveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailItemRemoveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailItemRemoveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
