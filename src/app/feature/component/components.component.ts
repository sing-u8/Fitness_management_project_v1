import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { StorageService } from '@services/storage.service'
import { state, style, transition, animate, trigger } from '@angular/animations'

import moment from 'moment-timezone'
@Component({
    selector: 'components',
    templateUrl: './components.component.html',
    styleUrls: ['./components.component.scss'],
    animations: [
        trigger('changeColor', [
            state(
                'change',
                style({
                    backgroundColor: '{{_changedColor}}',
                }),
                { params: { _changedColor: 'red' } }
            ),
            state(
                'default',
                style({
                    backgroundColor: 'antiquewhite',
                })
            ),
            transition('change => default', [animate('1s')]),
            transition('default => change', [animate('0.5s')]),
        ]),
    ],
})
export class ComponentsComponent implements OnInit {
    constructor(private storageService: StorageService) {}

    ngOnInit() {}

    // Checkbox
    checkbox = true
    clickCheckbox() {
        this.checkbox = !this.checkbox
    }

    // Radio Button
    radio = true
    clickRadio() {
        this.radio = !this.radio
    }

    // Switch
    switch1 = true
    switch2 = true
    switch3 = false

    // Select
    dropboxItems = [
        {
            name: '옵션 1',
            value: 'option 1',
        },
        {
            name: '옵션 2',
            value: 'option 2',
            disabled: true,
        },
        {
            name: '옵션 3',
            value: 'option 3',
        },
        {
            name: '옵션 4',
            value: 'option 4',
        },
        {
            name: '옵션 5',
            value: 'option 5',
        },
        {
            name: '옵션 6',
            value: 'option 6',
        },
        {
            name: '옵션 7',
            value: 'option 7',
        },
    ]
    selectedDropboxItem = {
        name: '옵션 1',
        value: 'option 1',
    }

    // Avatar
    picture = 'https://redwhale.s3.ap-northeast-2.amazonaws.com/user-profile/1614149725030'

    // DatePicker
    data1: any = {
        date: '2021-03-10',
    }
    data2: any = {
        startDate: '2021-03-14',
        endDate: '2021-03-20',
    }
    data3 = []
    data4 = {
        startDate: moment().format('YYYY-MM-DD'),
        endDate: '',
    }
    data5 = {
        startDate: moment().format('YYYY-MM-DD'),
        endDate: '',
    }
    data6 = {
        startDate: moment().format('2022-05-05'),
        endDate: '',
    }

    data7 = {
        startDate: moment().format('YYYY-MM-DD'),
        endDate: '',
    }
    data8 = {
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment(moment().add(4, 'days')).format('YYYY-MM-DD'),
    }

    data9: any = {
        date: '2021-03-10',
    }
    data10: any = {
        startDate: '2021-03-14',
        endDate: '2021-03-20',
    }
    data11 = []

    // TimePicker
    timeData = ''
    // timepicker2
    time2Obj = undefined

    // button
    buttonDisabled
    toggleButtonDisabled() {
        this.buttonDisabled = !this.buttonDisabled
    }

    // schedule modal
    generalModal = false
    showGeneral() {
        this.generalModal = true
    }
    onGeneralClick() {
        this.generalModal = false
    }
    lessonModal = false
    showLesson() {
        this.lessonModal = true
    }
    onLessonClick() {
        this.lessonModal = false
    }

    // Modal
    isVisible = false
    visibleData = {
        text: '문구를 입력해주세요.',
        subText: `서브 텍스트 문구를 입력해주세요.
        서브 텍스트 문구를 입력해주세요.`,
        cancelButtonText: '취소', // 선택
        confirmButtonText: '저장', // 선택
    }

    showModal() {
        this.isVisible = true
    }

    handleOk(): void {
        console.log('Button ok clicked!')
        this.isVisible = false
    }

    handleCancel(): void {
        console.log('Button cancel clicked!')
        this.isVisible = false
    }

    isVisible2 = false
    visibleData2 = {
        text: '문구를 입력해주세요.',
        subText: `서브 텍스트 문구를 입력해주세요.
        서브 텍스트 문구를 입력해주세요.`,
        confirmButtonText: '확인', // 선택
    }

    showModal2() {
        this.isVisible2 = true
    }

    handleOk2(): void {
        console.log('Button ok clicked!')
        this.isVisible2 = false
    }

    handleCancel2(): void {
        console.log('Button cancel clicked!')
        this.isVisible2 = false
    }

    // Toast
    toastVisible = false
    toastText = '초대가 거절되었습니다.'

    showToast() {
        this.toastVisible = true
    }

    hideToast() {
        this.toastVisible = false
    }

    // --
    changeBtColor = false
    defaultColor = 'antiquewhite'
    changedColor = 'red'

    toggleBtColor() {
        this.changeBtColor = !this.changeBtColor
    }
}
