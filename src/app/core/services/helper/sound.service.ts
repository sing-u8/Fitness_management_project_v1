import { Injectable } from '@angular/core'
import _ from 'lodash'

@Injectable({
    providedIn: 'root',
})
export class SoundService {
    private callEmployeeAudio = new Audio()
    constructor() {
        this.callEmployeeAudio.src = '/assets/sound/call_employee.wav'
    }

    callEmployee() {
        this.callEmployeeAudio.load()
        this.callEmployeeAudio.play()
    }
}
