import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DirectRegistrationComponent } from './direct-registration.component'

describe('DirectRegistrationComponent', () => {
    let component: DirectRegistrationComponent
    let fixture: ComponentFixture<DirectRegistrationComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DirectRegistrationComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(DirectRegistrationComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
