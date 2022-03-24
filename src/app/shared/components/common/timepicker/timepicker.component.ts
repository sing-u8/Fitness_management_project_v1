import { Component, Input, ElementRef, Renderer2, Output, EventEmitter, OnInit, NgZone } from '@angular/core'
import moment from 'moment-timezone'

@Component({
    selector: 'rw-timepicker',
    templateUrl: './timepicker.component.html',
    styleUrls: ['./timepicker.component.scss'],
})
export class TimepickerComponent implements OnInit {
    @Input() data: string
    @Output() dataChange = new EventEmitter<string>()
    hour: number
    minute: number
    amPm: string

    constructor(private zone: NgZone, private el: ElementRef, private renderer: Renderer2) {
        const time = moment().format('hh/mm/a')
        const timeArr = time.split('/')
        this.hour = Number(timeArr[0])
        this.minute = Number(timeArr[1])
        this.amPm = timeArr[2]
    }

    ngOnInit() {
        if (this.data) {
            const time = moment(this.data, 'HH:mm:ss').format('hh/mm/a')
            const timeArr = time.split('/')
            this.hour = Number(timeArr[0])
            this.minute = Number(timeArr[1])
            this.amPm = timeArr[2]
        } else {
            this.zone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.onChange()
                }, 1)
            })
        }
    }

    checkAmPm(amPm: string) {
        this.amPm = amPm
        this.onChange()
    }

    hourUp() {
        this.hour = (this.hour + 1) % 13
        this.hour = this.hour == 0 ? 1 : this.hour
        this.onChange()
    }

    hourDown() {
        this.hour = (this.hour - 1) % 13
        this.hour = this.hour == 0 ? 12 : this.hour
        this.onChange()
    }

    minuteUp() {
        this.minute = (this.minute + 1) % 60
        this.onChange()
    }

    minuteDown() {
        this.minute = (this.minute - 1) % 60
        this.minute = this.minute < 0 ? 59 : this.minute
        this.onChange()
    }

    formCheck(name: string) {
        if (name == 'hour') {
            if (this.hour > 12) {
                this.hour = 12
            } else if (this.hour < 1) {
                this.hour = 1
            }
        } else if (name == 'minute') {
            if (this.minute > 59) {
                this.minute = 59
            }
        }

        this.onChange()
    }

    digitCheck(event) {
        const code = event.which ? event.which : event.keyCode
        if (code < 48 || code > 57) {
            return false
        }
        return true
    }

    onChange() {
        const time = `${this.hour}:${this.minute} ${this.amPm}`
        this.dataChange.emit(moment(time, 'hh:mm a').format('HH:mm:ss'))
    }
}
