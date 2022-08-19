import { Component, OnInit, OnDestroy, SimpleChanges, ElementRef, Input, Output, EventEmitter } from '@angular/core'

import { CenterUser } from '@schemas/center-user'
import { SignatureConfirmOutput } from '@shared/components/common/signature-pad-modal/signature-pad-modal.component'

@Component({
    selector: 'db-contract-sign-box',
    templateUrl: './contract-sign-box.component.html',
    styleUrls: ['./contract-sign-box.component.scss'],
})
export class ContractSignBoxComponent implements OnInit {
    @Input() signData: string = undefined
    @Input() contractDate: string
    @Input() contractorName: string

    @Input() type: 'rw' | 'r' = 'rw'
    @Input() signedUrl: string // type : 'r' only

    @Output() onSign = new EventEmitter<string>()

    constructor() {}

    ngOnInit(): void {}

    // signature pad vars and methods
    public isSignaturePadVisible = false
    openSignaturePad() {
        if (this.type == 'r') return
        this.isSignaturePadVisible = true
    }
    onCancelSignaturePad() {
        this.isSignaturePadVisible = false
    }
    onConfirmSignaturePad(e: SignatureConfirmOutput) {
        this.isSignaturePadVisible = false
        this.signData = e.signData
        this.onSign.emit(e.signData)
    }
}
