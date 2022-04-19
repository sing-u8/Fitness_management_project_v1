import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { DomSanitizer } from '@angular/platform-browser'
import { DeviceDetectorService } from 'ngx-device-detector'
import _ from 'lodash'

import { InputType } from '../components/fare-guide-box/fare-guide-box.component'
import { TableInputType } from '../components/fare-guide-option-table/fare-guide-option-table.component'
import { FaqListType } from '../components/faq-list/faq-list.component'

@Component({
    selector: 'rw-fare-guide',
    templateUrl: './fare-guide.component.html',
    styleUrls: ['./fare-guide.component.scss'],
})
export class FareGuideComponent implements OnInit {
    public fareGuideBoxes: InputType[] = [
        {
            type: '무료형',
            price: '0원',
            price_unit: '/ 기간 무제한',
            desc_title: '레드웨일을 무료로 마음껏 사용해 보세요.',
            desc_element: {
                one: '모든 기능을 제한 없이 사용',
                two: '회원 수 250인 미만까지 제한',
            },
            button_name: '무료로 시작하기',
        },
        {
            type: '고급형',
            price: '3만원',
            price_unit: '/ 월 (센터 단위)',
            desc_title: '회원 수가 많다면 고급형을 추천해요!',
            desc_element: {
                one: '모든 기능을 제한 없이 사용',
                two: '회원 무제한 등록',
            },
            button_name: '도입 문의하기',
        },
    ]

    public fareGuideClickFuncs: Array<() => void> = [
        () => {
            this.toggleFreeStartModalVisible()
        },
        () => {
            this.router.navigateByUrl('/introduction-inquiry')
        },
    ]

    public optionTables: TableInputType[] = [
        {
            header: {
                one: '관리자 기능 비교',
                two: '무료형',
                three: '고급형',
            },
            bodyItems: [
                {
                    one: '무제한 회원 등록',
                    two: false,
                    three: true,
                },
                {
                    one: '웹 이용',
                    two: true,
                    three: true,
                    subText: '관리자 앱은 곧 추가될 예정이에요!',
                },
                {
                    one: '터치패드 출석',
                    two: true,
                    three: true,
                },
                {
                    one: '간편 QR코드 회원 등록',
                    two: true,
                    three: true,
                },
                {
                    one: '회원 목록 열람',
                    two: true,
                    three: true,
                },
                {
                    one: '회원권 관리',
                    two: true,
                    three: true,
                },
                {
                    one: '홀딩 관리',
                    two: true,
                    three: true,
                },
                {
                    one: '미수금 조회',
                    two: true,
                    three: true,
                },
                {
                    one: '일정 관리',
                    two: true,
                    three: true,
                },
                {
                    one: '예약 관리',
                    two: true,
                    three: true,
                },
                {
                    one: '횟수 자동 차감',
                    two: true,
                    three: true,
                },
                {
                    one: '락커 관리',
                    two: true,
                    three: true,
                },
                {
                    one: '매출 관리',
                    two: true,
                    three: true,
                },
                {
                    one: '센터 공지',
                    two: true,
                    three: true,
                },
                {
                    one: '채팅',
                    two: true,
                    three: true,
                },
            ],
        },
        {
            header: {
                one: '회원 기능 비교',
                two: '무료형',
                three: '고급형',
            },
            bodyItems: [
                {
                    one: '앱 이용',
                    two: true,
                    three: true,
                },
                {
                    one: '수업 예약',
                    two: true,
                    three: true,
                },
                {
                    one: '예약 내역 조회',
                    two: true,
                    three: true,
                },
                {
                    one: '결제 내역 조회',
                    two: true,
                    three: true,
                },
                {
                    one: '예약 자동 알림',
                    two: true,
                    three: true,
                },
                {
                    one: '센터 공지 알림',
                    two: true,
                    three: true,
                },
                {
                    one: '채팅',
                    two: true,
                    three: true,
                },
            ],
        },
    ]

    public faqList: FaqListType[] = [
        {
            title: '레드웨일 이용 요금이 얼마인가요?',
            desc: '월 이용료 3만원으로 레드웨일의 모든 기능을 사용하실 수 있습니다. 월 이용료 외 별도 요금은 발생하지 않으며, 부가가치세 10%가 별도로 청구될 수 있습니다.',
            isOpen: false,
        },
        {
            title: '요금 결제는 어떻게 하나요?',
            desc: '회원 수 250인 미만까지 모든 기능을 무료로 사용해보실 수 있습니다.  회원 수 250인을 초과한 경우, 자동으로 결제할 수 있도록 서비스에서 안내해드리고 있습니다. 월 이용료는 계좌이체만 가능하며, 전자 세금 계산서를 발급해드립니다.',
            isOpen: false,
        },
        {
            title: '월별 결제 외에 장기 결제도 있나요?',
            desc: this.domSanitizer.bypassSecurityTrustHtml(
                `<div>죄송하지만 현재 레드웨일은 월별 결제만을 제공하고 있습니다. 장기 결제를 원하실 경우, <a href='/introduction-inquiry' style="cursor:pointer; color:var(--red);">도입 문의</a> 또는 페이지 우측 하단의 채팅을 이용해 관련 문의 부탁드립니다.</div>`
            ),
            isOpen: false,
        },
        {
            title: '다지점 할인은 어떻게 받나요?',
            desc: this.domSanitizer
                .bypassSecurityTrustHtml(`<div>3개 이상의 지점을 보유하고 계실 경우, 월 이용료의 30%를 즉시 할인 받으실 수 있습니다. 다지점 할인이 필요하신 경우,
                <a href='/introduction-inquiry' style="cursor:pointer; color:var(--red);">도입 문의</a>를 이용해 다지점 할인 문의를 남겨주시면 빠르게 상담해드리겠습니다.</div>`),
            isOpen: false,
        },
        {
            title: '서비스 이용을 취소하고 싶은데, 환불 받을 수 있나요?',
            desc: '환불이 가능합니다. 서비스 사용 기간을 일별 요금으로 산출하여, 월 요금에서 사용하신 만큼의 요금을 제한 후 환불해 드리고 있습니다.',
            isOpen: false,
        },
    ]

    constructor(
        private deviceDetector: DeviceDetectorService,
        private router: Router,
        private domSanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {}

    // ----------  free start modal ---------------//
    public isFreeStartModalVisible = false
    toggleFreeStartModalVisible() {
        if (this.deviceDetector.isDesktop()) {
            this.router.navigateByUrl('/auth/login')
        } else {
            this.isFreeStartModalVisible = !this.isFreeStartModalVisible
        }
    }
    onFreeStartCancel() {
        this.isFreeStartModalVisible = false
    }

    //
    routerTo(url: string) {
        this.router.navigateByUrl(`/${url}`)
    }
}
