import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DwChattingRoomSelectComponent } from './dw-chatting-room-select.component';

describe('DwChattingRoomSelectComponent', () => {
  let component: DwChattingRoomSelectComponent;
  let fixture: ComponentFixture<DwChattingRoomSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DwChattingRoomSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DwChattingRoomSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
