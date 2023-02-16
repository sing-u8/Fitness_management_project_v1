import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

export type FaqListType = {
    title: string
    desc: string | SafeHtml
    isOpen: boolean
    categ: string
}

@Component({
    selector: 'hp-faq-list-section',
    templateUrl: './faq-list-section.component.html',
    styleUrls: ['./faq-list-section.component.scss'],
})
export class FaqListSectionComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() faqList: Array<FaqListType> = [
        {
            title: `요금 결제는 어떻게 하나요?`,
            desc: this.domSanitizer.bypassSecurityTrustHtml(
                `<div>요금은 센터 단위로 부과되므로 로그인 후 먼저 센터를 생성하셔야 합니다. 센터 생성을 마친 후, <b>[센터 설정] 메뉴에서 결제를 진행</b>하실 수 있습니다. 단, 문자 요금은 별도로 [문자] 메뉴에서 결제가 이루어 집니다.</div>`
            ),
            isOpen: false,
            categ: '카테고리',
        },
        {
            title: `가입비나 초기 설치 비용은 얼마인가요?`,
            desc: this.domSanitizer.bypassSecurityTrustHtml(
                `<div><b>가입비 및 초기 설치 비용은 없습니다.</b> 레드웨일은 서비스 이용료 외 추가 요금이 발생하지 않습니다.</div>`
            ),
            isOpen: false,
            categ: '카테고리',
        },
        {
            title: `문자 비용은 얼마인가요?`,
            desc: this.domSanitizer.bypassSecurityTrustHtml(
                `<div>문자 비용은 <b>단문 12원, 장문 32원</b>으로 업계 최저가로 제공해 드리고 있습니다.</div>`
            ),
            isOpen: false,
            categ: '카테고리',
        },
        {
            title: `무료 체험은 어떻게 하나요?`,
            desc: this.domSanitizer.bypassSecurityTrustHtml(
                `<div>로그인 후 [무료로 시작하기] 버튼을 눌러 무료 체험을 시작하실 수 있습니다. 레드웨일 서비스에서 <b>센터를 생성하시면 2주간의 무료 체험이 자동으로 시작</b>됩니다.</div>`
            ),
            isOpen: false,
            categ: '카테고리',
        },
        {
            title: `기존 회원 정보 이동이 가능한가요?`,
            desc: this.domSanitizer.bypassSecurityTrustHtml(
                `<div>네 가능합니다. 레드웨일의 엑셀 양식에 맞게 기존 회원 정보를 입력하여 보내주시면 기존 회원 정보를 일괄 등록해드리고 있습니다.</div>`
            ),
            isOpen: false,
            categ: '카테고리',
        },
        {
            title: `다지점 할인이 가능한가요?`,
            desc: this.domSanitizer.bypassSecurityTrustHtml(
                `<div>3개 이상의 지점을 보유하고 계시다면, 다지점 할인 혜택을 받으실 수 있습니다. <b>카카오 상담</b>을 통해 문의를 남겨주시면 검토 후 견적서를 전송해 드립니다.</div>`
            ),
            isOpen: false,
            categ: '카테고리',
        },
        {
            title: `서비스 이용을 취소하고 싶은데, 환불 받을 수 있나요?`,
            desc: this.domSanitizer.bypassSecurityTrustHtml(
                `<div>요금제별 환불 가능 <b>기간 내에 환불 요청 시 전액 환불이 가능</b>합니다. 단, 환불 기간이 지난 경우에는 환불이 불가한 점 양해 부탁드립니다.</div>`
            ),
            isOpen: false,
            categ: '카테고리',
        },
        {
            title: `레드웨일을 통해 터치 모니터를 구매할 수 있나요?`,
            desc: this.domSanitizer.bypassSecurityTrustHtml(
                `<div>합리적인 서비스 가격을 보장하기 위해 터치 모니터를 별도로 판매하고 있지 않습니다. 시중에서 판매되고 있는 터치 모니터를 직접 구입하여 사용하실 것을 권장드립니다.</div>`
            ),
            isOpen: false,
            categ: '카테고리',
        },
        {
            title: `회원용 앱 외에도 관리자용 앱이 있나요?`,
            desc: this.domSanitizer.bypassSecurityTrustHtml(
                `<div>현재 관리자용 앱을 개발하고 있으며, 2023년도 출시 예정입니다.</div>`
            ),
            isOpen: false,
            categ: '카테고리',
        },
    ]
    @Input() categs: Array<string>
    constructor(private domSanitizer: DomSanitizer) {}
    ngOnInit(): void {
        this.categs = ['카테고리']
        this.faqDisplayList = this.faqList
    }
    ngAfterViewInit(): void {
        this.pageNumberInit()
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['faqList'] && !changes['faqList'].firstChange) {
            this.faqDisplayList = this.faqList
        }
    }

    public curCateg = '전체'
    public faqDisplayList: Array<FaqListType> = []

    public pageIndexList = []
    public pageNumber = 1
    increasePageNumber() {
        this.pageNumber = this.pageIndexList.length <= this.pageNumber ? this.pageNumber : this.pageNumber + 1
    }
    decreasePageNumber() {
        this.pageNumber = this.pageNumber <= 1 ? this.pageNumber : this.pageNumber - 1
    }
    setPageNumber(v: number) {
        this.pageNumber = v
    }
    pageNumberInit() {
        let pageIndex = parseInt(String(this.faqDisplayList.length / 10))
        pageIndex = this.faqDisplayList.length % 10 > 0 ? pageIndex + 1 : pageIndex
        this.pageIndexList = Array.from({ length: pageIndex }, (v, i) => i + 1)
    }

    toggleFAQ(idx: number) {
        this.faqDisplayList[idx].isOpen = !this.faqDisplayList[idx].isOpen
    }

    selectCateg(categ: string) {
        this.curCateg = categ
        if (categ == '전체') {
            this.faqDisplayList = this.faqList
        } else {
            this.faqDisplayList = this.faqList.filter((value) => value.categ == categ)
        }
        this.pageNumberInit()
        this.pageNumber = 1
    }
}
