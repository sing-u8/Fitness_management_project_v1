import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { WordService } from '@services/helper/word.service'
import { StorageService } from '@services/storage.service'
import { FileService } from '@services/file.service'

import { Center } from '@schemas/center'

import _ from 'lodash'

// ngrx
import { Store } from '@ngrx/store'
import * as DashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import { showToast } from '@appStore/actions/toast.action'
import { Contract } from '@schemas/contract'
import { SignatureConfirmOutput } from '@shared/components/common/signature-pad-modal/signature-pad-modal.component'

@Component({
    selector: 'db-user-detail-contract',
    templateUrl: './user-detail-contract.component.html',
    styleUrls: ['./user-detail-contract.component.scss'],
})
export class UserDetailContractComponent implements OnInit {
    @Input() curUserData: DashboardReducer.CurUserData = _.cloneDeep(DashboardReducer.CurUserDataInit)
    @Output() onRegisterML = new EventEmitter<void>()

    constructor(
        private nxStore: Store,
        private wordService: WordService,
        private storageService: StorageService,
        private fileService: FileService
    ) {}

    ngOnInit(): void {}

    public isSignaturePadVisible = false
    openSignaturePad() {
        this.isSignaturePadVisible = true
    }
    onCancelSignaturePad() {
        this.isSignaturePadVisible = false
    }
    onConfirmSignaturePad(e: SignatureConfirmOutput) {
        e.loadingFns.showLoading()
        this.nxStore.dispatch(
            DashboardActions.startContractSign({
                centerId: this.center.id,
                centerUserId: this.curUserData.user.id,
                centerContractId: this.selectedContract.id,
                signUrl: e.signData,
                cb: () => {
                    e.loadingFns.hideLoading()
                    this.isSignaturePadVisible = false
                    this.nxStore.dispatch(
                        showToast({
                            text: `[${this.curUserData.user.center_user_name}] 전자 서명 작성이 완료되었습니다.`,
                        })
                    )
                },
            })
        )
    }

    public center: Center = this.storageService.getCenter()

    public selectedContract: Contract = undefined
    setSelectedPayment(contract: Contract) {
        this.selectedContract = contract
    }

    // check contract modal vars and methods
    public isCCFullModalVisible = false
    openCCFullModal() {
        this.isCCFullModalVisible = true
    }
    closeCCFullModal() {
        this.isCCFullModalVisible = false
    }
}
