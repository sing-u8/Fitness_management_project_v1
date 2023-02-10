import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { DeviceDetectorService } from 'ngx-device-detector'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import _ from 'lodash'
import { FormBuilder } from '@angular/forms'
import { FaqListType } from '../components/faq-list/faq-list.component'

@Component({
    selector: 'rw-introduction-inquiry',
    templateUrl: './introduction-inquiry.component.html',
    styleUrls: ['./introduction-inquiry.component.scss'],
})
export class IntroductionInquiryComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private deviceDetector: DeviceDetectorService,
        private router: Router,
        private domSanitizer: DomSanitizer
    ) {
        const h = document.getElementById('l-homepage')
        h.scrollTo({ top: 0 })
    }

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
}

// &#13;&#10;
