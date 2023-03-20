import { Component, OnInit, OnDestroy } from '@angular/core'
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { DeviceDetectorService } from 'ngx-device-detector'
import { WordService } from '@services/helper/word.service'
import _ from 'lodash'

import { FaqListType } from '../components/faq-list/faq-list.component'
import { FGOTable } from '../components/fare-guide-option-table2/fare-guide-option-table2.component'
import { PaymentItem } from '@schemas/components/payment-item'
import { paymentItemList } from '@shared/helper/center-payment'

import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators'

@Component({
    selector: 'rw-fare-guide',
    templateUrl: './fare-guide.component.html',
    styleUrls: ['./fare-guide.component.scss'],
})
export class FareGuideComponent implements OnInit, OnDestroy {
    public fareGuideBoxList: PaymentItem[] = paymentItemList

    public sec2FGOItems: Array<{ text: string | SafeHtml; tableData: FGOTable[] }> = [
        {
            text: this.domSanitizer.bypassSecurityTrustHtml(
                '👀  <span style="text-decoration: underline; text-underline-offset: -1.5px; text-decoration-thickness: 7px; text-decoration-color: var(--red);">센터 관리자</span>를 위한 기능 미리보기'
            ),
            tableData: [
                { title: '기본', items: ['관리자용 웹 제공', '터치패드 출석', '회원 정보 이동'] },
                {
                    title: '회원 관리',
                    items: [
                        '무제한 회원 등록',
                        '전자 계약서 작성',
                        '미수금 조회',
                        '홀딩 관리',
                        '종류별 회원 목록 열람',
                    ],
                },
                { title: '센터 관리', items: ['회원권 관리', '스케줄 관리', '예약 관리', '락커 관리', '매출 관리'] },
                { title: '소통', items: ['센터 공지', '문자 전송', '무료 채팅'] },
            ],
        },
        {
            text: this.domSanitizer.bypassSecurityTrustHtml(
                '👀 <span style="text-decoration: underline; text-underline-offset: -1.5px; text-decoration-thickness: 7px; text-decoration-color: var(--red);">센터 회원</span>을 위한 기능 미리보기'
            ),
            tableData: [
                { title: '기본', items: ['회원용 앱 제공'] },
                {
                    title: '회원 관리',
                    items: [
                        '수업 직접 예약',
                        '예약 자동 알림',
                        '예약 내역 조회',
                        '결제 내역 조회',
                        '회원권 횟수 자동 차감',
                    ],
                },
                { title: '소통', items: ['센터 공지 알림', '직원-회원간 채팅'] },
            ],
        },
    ]

    public sec2FooterItemList = [
        '상담원 연결 없이도 즉시 무료로 사용 가능',
        '혼자서도 할 수 있는 간편 초기 설정',
        '이용 가이드 제공',
    ]

    public faqList: FaqListType[] = [
        {
            title: '가입비나 초기 설치 비용은 얼마인가요?',
            desc: this.domSanitizer.bypassSecurityTrustHtml(
                '<div><b>가입비 및 초기 설치 비용은 없습니다.</b> 레드웨일은 서비스 이용료 외 추가 요금이 발생하지 않습니다.</div>'
            ),
            isOpen: false,
        },
        {
            title: '문자 비용은 얼마인가요?',
            desc: this.domSanitizer.bypassSecurityTrustHtml(
                '<div>문자 비용은 <b>단문 12원, 장문 32원</b>으로 업계 최저가로 제공해 드리고 있습니다.</div>'
            ),
            isOpen: false,
        },
        {
            title: '무료 체험은 어떻게 하나요?',
            desc: this.domSanitizer.bypassSecurityTrustHtml(
                '<div>로그인 후 [무료로 시작하기] 버튼을 눌러 무료 체험을 시작하실 수 있습니다. 레드웨일 서비스에서 <b>센터를 생성하시면 2주간의 무료 체험이 자동으로 시작</b>됩니다.</div>'
            ),
            isOpen: false,
        },
        {
            title: '요금 결제는 어떻게 하나요?',
            desc: this.domSanitizer.bypassSecurityTrustHtml(
                `<div>요금은 센터 단위로 부과되므로 로그인 후 먼저 센터를 생성하셔야 합니다. 센터 생성을 마친 후, <b>[센터 설정] 메뉴에서 결제를 진행</b>하실 수 있습니다. 단, 문자 요금은 별도로 [문자] 메뉴에서 결제가 이루어 집니다.</div>`
            ),
            isOpen: false,
        },
        {
            title: '기존 회원 정보 이동이 가능한가요?',
            desc:
                '네 가능합니다. 레드웨일의 엑셀 양식에 맞게 기존 회원 정보를 입력하여 보내주시면 기존 회원 정보를 일괄\n' +
                '등록해 드리고 있습니다.',
            isOpen: false,
        },
        {
            title: '다지점 할인이 가능한가요?',
            desc: this.domSanitizer.bypassSecurityTrustHtml(
                '<div>3개 이상의 지점을 보유하고 계시다면, 다지점 할인 혜택을 받으실 수 있습니다. <b>카카오 상담</b>을 통해 문의를 남겨주시면 검토 후 견적서를 전송해드려요.</div>'
            ),
            isOpen: false,
        },
        {
            title: '서비스 이용을 취소하고 싶은데, 환불 받을 수 있나요?',
            desc: this.domSanitizer.bypassSecurityTrustHtml(
                '<div>요금제별 환불 가능 <b>기간 내에 환불 요청 시 전액 환불이 가능</b>합니다. 단, 환불 기간이 지난 경우에는 환불이 불가한 점 양해부탁드립니다.</div>'
            ),
            isOpen: false,
        },
    ]

    // -- charge calc vars ---//
    public chargeCalc: FormControl
    public chargeCalcNum = 0
    public allPassCharge = 759000
    public chargeCalcMonth = 0
    public chargeSaving = 0
    calcChargeVars() {
        const v = Number(_.camelCase(this.chargeCalc.value))
        this.chargeCalcMonth = _.isFinite(_.ceil(this.allPassCharge / v)) ? _.ceil(this.allPassCharge / v) : 0
        this.chargeSaving = 10 * 12 * v - this.allPassCharge > 0 ? 10 * 12 * v - this.allPassCharge : 0
        this.chargeCalcNum = Number(_.camelCase(this.chargeCalc.value))
    }

    public unSubscriber$ = new Subject<boolean>()

    constructor(
        private deviceDetector: DeviceDetectorService,
        private router: Router,
        private domSanitizer: DomSanitizer,
        private fb: FormBuilder,
        private wordService: WordService
    ) {
        const h = document.getElementById('l-homepage')
        h.scrollTo({ top: 0 })

        this.chargeCalc = this.fb.control('0', {
            validators: [Validators.pattern(`^[0-9]{10,11}$`)],
        })
        this.calcChargeVars()

        this.chargeCalc.valueChanges
            .pipe(takeUntil(this.unSubscriber$), distinctUntilChanged(), debounceTime(100))
            .subscribe((value) => {
                this.calcChargeVars()
                this.chargeCalc.setValue(this.wordService.getNumberWithCommas(_.camelCase(_.trimStart(value, '0'))))
            })
    }

    ngOnInit(): void {}
    ngOnDestroy() {
        this.unSubscriber$.next(true)
        this.unSubscriber$.complete()
    }

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
