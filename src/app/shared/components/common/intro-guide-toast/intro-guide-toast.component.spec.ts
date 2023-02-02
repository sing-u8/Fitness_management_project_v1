import { ComponentFixture, TestBed } from '@angular/core/testing'

import { IntroGuideToastComponent } from './intro-guide-toast.component'

describe('IntroGuideToastComponent', () => {
    let component: IntroGuideToastComponent
    let fixture: ComponentFixture<IntroGuideToastComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IntroGuideToastComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(IntroGuideToastComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
