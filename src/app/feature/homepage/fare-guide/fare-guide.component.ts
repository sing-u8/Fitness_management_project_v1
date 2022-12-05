import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { DomSanitizer } from '@angular/platform-browser'
import { DeviceDetectorService } from 'ngx-device-detector'
import _ from 'lodash'

import { InputType } from '../components/fare-guide-box/fare-guide-box.component'
import { TableInputType } from '../components/fare-guide-option-table/fare-guide-option-table.component'
import { FaqListType } from '../components/faq-list/faq-list.component'

import {DataType} from '../components/fare-guide-box2/fare-guide-box2.component'
import {FGOTable} from '../components/fare-guide-option-table2/fare-guide-option-table2.component'

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
    
    public fareGuideBoxList: DataType[] = [
        {
            top: {
                title: '월 이용권',
                desc: '매월 자동 결제되는 요금제'
            },
            middle: {
                discountText: '런칭 기념 5% 할인 (첫 6개월간)',
                originalPrice: '39,000원',
                price:'37,000원',
                desc: '1개 센터 기준 / 월'
            },
            bottom: [
                {left: '기능 제한', right: '없음'},
                {left: '결제 방식', right: '자동 결제'},
                {left: '결제 금액', right: '37,000원 / 월'},
                {left: '혜택', right: '7일 이내 환불 가능'},
            ],
        },
        {
            top: {
                title: '1년 이용권',
                desc: '1년 요금을 선납 결제하는 요금제'
            },
            middle: {
                discountText: '런칭 기념 15% 할인',
                originalPrice: '39,000원',
                price:'33,000원',
                desc: '1개 센터 기준 / 월 (연간 계약)'
            },
            bottom: [
                {left: '기능 제한', right: '없음'},
                {left: '결제 방식', right: '직접 결제 (선납)'},
                {left: '결제 금액', right: '396,000원 / 1년'},
                {left: '혜택', right: '30일 이내 환불 가능'},
            ],
            highlight:'🎉  가장 인기가 많아요!'
        },
        {
            top: {
                title: '2년 이용권',
                desc: '2년 요금을 선납 결제하는 요금제'
            },
            middle: {
                discountText: '런칭 기념 30% 할인',
                originalPrice: '39,000원',
                price:'27,300원',
                desc: '1개 센터 기준 / 월 (2년간 계약)'
            },
            bottom: [
                {left: '기능 제한', right: '없음'},
                {left: '결제 방식', right: '직접 결제 (선납)'},
                {left: '결제 금액', right: '655,000원 / 2년'},
                {left: '혜택', right: '7일 이내 환불 가능'},
            ],
        },
        {
            top: {
                title: '평생 이용권',
                desc: '단 한 번 결제로 평생 이용하는 요금제'
            },
            middle: {
                discountText: '런칭 기념 45% 할인',
                originalPrice: '1,380,000원',
                price:'759,000원',
                desc: '1개 센터 기준 / 평생'
            },
            bottom: [
                {left: '기능 제한', right: '없음'},
                {left: '결제 방식', right: '직접 결제 (선납)'},
                {left: '결제 금액', right: '759,000원 / 평생'},
                {left: '혜택', right: '90일 이내 환불 가능'},
            ],
            highlight:'👍  레드웨일 추천'
        }
    ]
    
    public sec2FGOItems: Array<{text: string; tableData: FGOTable[]}> = [
        {
            text: '👀  센터 관리자를 위한 기능 미리보기',
            tableData: [
                {title: '기본', items: ['관리자용 웹 제공', '터치패드 출석','회원 정보 이동']},
                {title: '회원 관리', items: ['무제한 회원 등록', '전자 계약서 작성','미수금 조회', '홀딩 관리','종류별 회원 목록 열람' ]},
                {title: '센터 관리', items: ['회원권 관리', '스케줄 관리','예약 관리','락커 관리', '매출 관리']},
                {title: '소통', items: ['센터 공지', '문자 전송','무료 채팅']},
            ]
        },
        {
            text: '👀  센터 회원을 위한 기능 미리보기',
            tableData: [
                {title: '기본', items: ['회원용 앱 제공']},
                {title: '회원 관리', items: ['수업 직접 예약', '예약 자동 알림', '예약 내역 조회', '결제 내역 조회', '회원권 횟수 자동 차감']},
                {title: '소통', items: ['센터 공지 알림', '직원-회원간 채팅']},
            ]
        }
        
    ]
    
    public sec2FooterItemList = [
        '상담원 연결 없이도 즉시 무료로 사용 가능',
        '혼자서도 할 수 있는 간편 초기 설정',
        '이용 가이드 제공'
    ]
    
    public faqList: FaqListType[] = [
        {
            title: '가입비나 초기 설치 비용은 얼마인가요?',
            desc: this.domSanitizer.bypassSecurityTrustHtml('<div><b>가입비 및 초기 설치 비용은 없습니다.</b> 레드웨일은 서비스 이용료 외 추가 요금이 발생하지 않습니다.</div>'),
            isOpen: false,
        },
        {
            title: '문자 비용은 얼마인가요?',
            desc: this.domSanitizer.bypassSecurityTrustHtml('<div>문자 비용은 <b>단문 12원, 장문 32원</b>으로 업계 최저가로 제공해 드리고 있습니다.</div>'),
            isOpen: false,
        },
        {
            title: '무료 체험은 어떻게 하나요?',
            desc: this.domSanitizer.bypassSecurityTrustHtml('<div>로그인 후 [무료로 시작하기] 버튼을 눌러 무료 체험을 시작하실 수 있습니다. 레드웨일 서비스에서 <b>센터를 생성하시면 2주간의 무료 체험이 자동으로 시작</b>됩니다.</div>'),
            isOpen: false,
        },
        {
            title: '요금 결제는 어떻게 하나요?',
            desc: this.domSanitizer
                .bypassSecurityTrustHtml(`<div>요금은 센터 단위로 부과되므로 로그인 후 먼저 센터를 생성하셔야 합니다. 센터 생성을 마친 후, <b>[센터 설정] 메뉴에서 결제를 진행</b>하실 수 있습니다. 단, 문자 요금은 별도로 [문자] 메뉴에서 결제가 이루어 집니다.</div>`),
            isOpen: false,
        },
        {
            title: '기존 회원 정보 이동이 가능한가요?',
            desc: '네 가능합니다. 레드웨일의 엑셀 양식에 맞게 기존 회원 정보를 입력하여 보내주시면 기존 회원 정보를 일괄\n' +
                '등록해 드리고 있습니다.',
            isOpen: false,
        },{
            title: '다지점 할인이 가능한가요?',
            desc: this.domSanitizer
                .bypassSecurityTrustHtml('<div>3개 이상의 지점을 보유하고 계시다면, 다지점 할인 혜택을 받으실 수 있습니다. <b>카카오 상담</b>을 통해 문의를 남겨주시면 검토 후 견적서를 전송해드려요.</div>'),
            isOpen: false,
        },{
            title: '서비스 이용을 취소하고 싶은데, 환불 받을 수 있나요?',
            desc: this.domSanitizer
                .bypassSecurityTrustHtml('<div>요금제별 환불 가능 <b>기간 내에 환불 요청 시 전액 환불이 가능</b>합니다. 단, 환불 기간이 지난 경우에는 환불이 불가한 점 양해부탁드립니다.</div>'),
            isOpen: false,
        },
    ]
    

    constructor(
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
    routerTo(url: string) {
        this.router.navigateByUrl(`/${url}`)
    }
}
