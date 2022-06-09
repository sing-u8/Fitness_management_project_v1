import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DragGuideComponent } from './drag-guide.component'

describe('DragGuideComponent', () => {
    let component: DragGuideComponent
    let fixture: ComponentFixture<DragGuideComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DragGuideComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(DragGuideComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
