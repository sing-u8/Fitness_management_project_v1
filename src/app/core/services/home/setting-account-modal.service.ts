import { Injectable } from '@angular/core'
import { modalType, modalData } from '@schemas/home/setting-account-modal'

@Injectable({
    providedIn: 'root',
})
export class SettingAccountModalService {
    constructor() {}
    initModal(type: modalType): modalData {
        let data: modalData
        switch (type) {
            case 'DELAVATAR':
                data = {
                    text: '프로필 사진을 삭제하시겠어요?',
                    subText: `프로필 사진을 삭제하실 경우,
                              삭제된 사진은 복구가 불가능합니다.`,
                    cancelButtonText: '취소',
                    confirmButtonText: '삭제',
                }
                return data

            case 'NAME':
                data = {
                    text: '이름 변경',
                    subText: `원활한 센터 이용을 위해 회원님의 실명을 입력해주세요.`,
                    cancelButtonText: '취소',
                    confirmButtonText: '저장하기',
                }
                return data

            case 'EMAIL':
                data = {
                    text: '이메일 변경',
                    subText: `계정 보호를 위해 새로운 이메일 주소에 대한 인증이 필요해요.
                              입력한 이메일 주소로 받으신 인증번호를 입력해주세요.`,
                    cancelButtonText: '취소',
                    confirmButtonText: '저장하기',
                }
                return data

            case 'PHONE':
                data = {
                    text: '전화번호 변경',
                    subText: `계정 보호를 위해 새로운 전화번호에 대한 인증이 필요해요.
                              입력한 전화번호로 받으신 인증번호를 입력해주세요.`,
                    cancelButtonText: '취소',
                    confirmButtonText: '저장하기',
                }
                return data

            case 'PASSWORD':
                data = {
                    text: '비밀번호 변경',
                    subText: `기존 비밀번호을 입력하시면, 새로운 비밀번호 설정이 가능해요.`,
                    cancelButtonText: '취소',
                    confirmButtonText: '저장하기',
                }
                return data

            case 'SEX':
                data = {
                    text: '성별 변경',
                    subText: `원활한 센터 이용을 위해 회원님의 성별을 선택해주세요.`,
                    cancelButtonText: '취소',
                    confirmButtonText: '저장하기',
                }
                return data

            case 'BIRTH_DATE':
                data = {
                    text: '생년월일 변경',
                    subText: `원활한 센터 이용을 위해 회원님의 생년월일을 입력해주세요.`,
                    cancelButtonText: '취소',
                    confirmButtonText: '저장하기',
                }
                return data

            case 'MARKETING_AGREE':
                data = {
                    text: '마케팅 수신 동의',
                    subText: `🎁 레드웨일의 선물! 건강에 대한 유용한 정보를 받아보세요.`,
                    cancelButtonText: '취소',
                    confirmButtonText: '저장하기',
                }
                return data

            case 'PUSH_NOTICE':
                data = {
                    text: '푸시 알림',
                    subText: `푸시 알림을 끄면, 레드웨일 및 센터의 알림을 모두 받아보실 수 없어요.`,
                    cancelButtonText: '취소',
                    confirmButtonText: '저장하기',
                }
                return data
        }
    }
}
