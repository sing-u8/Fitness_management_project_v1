import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core'

import _ from 'lodash'
import dayjs from 'dayjs'
import { originalOrder } from '@helpers/pipe/keyvalue'

import { Contract } from '@schemas/contract'

import { WordService } from '@services/helper/word.service'
import { TimeService } from '@services/helper/time.service'

@Component({
    selector: 'db-user-detail-contract-item',
    templateUrl: './user-detail-contract-item.component.html',
    styleUrls: ['./user-detail-contract-item.component.scss'],
})
export class UserDetailContractItemComponent implements OnInit, AfterViewInit {
    @Input() contract: Contract

    @Output() onSign = new EventEmitter<Contract>()
    @Output() onContractDetail = new EventEmitter<Contract>()

    public originalOrder = originalOrder

    public showMenuDropDown = false
    toggleMenuDropDown() {
        this.showMenuDropDown = !this.showMenuDropDown
    }
    hideMenuDropDown() {
        this.showMenuDropDown = false
    }

    public menuDropDownItemObj = {
        contractDetail: {
            name: '계약 내용 확인',
            color: 'var(--font-color)',
            visible: true,
            func: () => {
                this.onContractDetail.emit(this.contract)
            },
        },
        sign: {
            name: '전자 서명',
            color: 'var(--font-color)',
            visible: true,
            func: () => {
                this.onSign.emit(this.contract)
            },
        },
    }

    constructor(private wordService: WordService) {}

    ngOnInit(): void {}
    ngAfterViewInit() {
        this.menuDropDownItemObj.sign.visible = !this.contract.user_sign
        this.initContractorName()
        this.initContractType()
    }

    public contractorName = ''
    initContractorName() {
        const contractors = _.split(this.contract.responsibility, ',').map((v) => v.trim())
        this.contractorName =
            contractors.length == 1 ? `${contractors[0]}` : `${contractors[0]} 외 ${contractors.length - 1}명`
    }

    public contractType = ''
    initContractType() {
        this.contractType =
            this.contract.type_code == 'contract_type_new'
                ? '신규 등록'
                : this.contract.type_code == 'contract_type_renewal'
                ? '재등록'
                : '양도'
    }
}
