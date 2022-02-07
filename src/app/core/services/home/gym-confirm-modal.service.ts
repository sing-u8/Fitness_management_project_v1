import { Injectable } from '@angular/core'
import { modalType, modalData } from '@schemas/home/gym-confirm-modal'

@Injectable({
    providedIn: 'root',
})
export class GymConfirmModalService {
    constructor() {}

    initModal(type: modalType): modalData {
        let data: modalData
        switch (type) {
            case 'leaveCenter':
                data = {
                    text: '센터에서 나가시겠습니까?',
                    subText: `센터에서 나갈 경우,
                              더이상 해당 센터에 접속할 수 없어요.`,
                    cancelButtonText: '취소',
                    confirmButtonText: '나가기',
                }
                return data

            case 'acceptInvite':
                data = {
                    text: '초대를 수락하시겠습니까?',
                    subText: `초대를 수락할 경우,
                              내 계정에 해당 센터가 자동으로 생성돼요.`,
                    cancelButtonText: '취소',
                    confirmButtonText: '수락',
                }
                return data

            case 'rejectInvite':
                data = {
                    text: '초대를 거절하시겠습니까?',
                    subText: `초대를 거절할 경우,
                              해당 초대 내역이 사라져요.`,
                    cancelButtonText: '취소',
                    confirmButtonText: '거절',
                }
                return data
        }
    }

    onAccept(type: modalType) {
        switch (type) {
            case 'leaveCenter':
                break
            case 'acceptInvite':
                break
            case 'rejectInvite':
                break
        }
    }
}
