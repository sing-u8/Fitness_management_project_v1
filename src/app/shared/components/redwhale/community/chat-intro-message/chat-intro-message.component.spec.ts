import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatIntroMessageComponent } from './chat-intro-message.component';

describe('ChatIntroMessageComponent', () => {
  let component: ChatIntroMessageComponent;
  let fixture: ComponentFixture<ChatIntroMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatIntroMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatIntroMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
