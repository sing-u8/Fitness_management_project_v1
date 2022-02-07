import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RemoveAccountModalComponent } from './remove-account-modal.component'

describe('RemoveAccountModalComponent', () => {
    let component: RemoveAccountModalComponent
    let fixture: ComponentFixture<RemoveAccountModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RemoveAccountModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(RemoveAccountModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
