import { Component, OnInit, Input, AfterViewInit } from '@angular/core'

export type FaqListType = {
    title: string
    desc: string
    isOpen: boolean
    categ: string
}

@Component({
    selector: 'hp-faq-list-section',
    templateUrl: './faq-list-section.component.html',
    styleUrls: ['./faq-list-section.component.scss'],
})
export class FaqListSectionComponent implements OnInit, AfterViewInit {
    @Input() faqList: Array<FaqListType>
    @Input() categs: Array<string>
    constructor() {
        this.faqList = Array.from({ length: 40 }, (v, i) => {
            if (i < 13) {
                return {
                    title: `자주 묻는 질문 ${i} c1`,
                    desc: '답변을 입력해주세요. 답변을 입력해주세요.',
                    isOpen: false,
                    categ: '카테고리1',
                }
            } else if (i < 20) {
                return {
                    title: `자주 묻는 질문 ${i - 13} c2`,
                    desc: '답변을 입력해주세요. 답변을 입력해주세요.',
                    isOpen: false,
                    categ: '카테고리2',
                }
            } else if (i < 30) {
                return {
                    title: `자주 묻는 질문 ${i - 20} c3`,
                    desc: '답변을 입력해주세요. 답변을 입력해주세요.',
                    isOpen: false,
                    categ: '카테고리3',
                }
            } else {
                return {
                    title: `자주 묻는 질문 ${i - 30} c4`,
                    desc: '답변을 입력해주세요. 답변을 입력해주세요.',
                    isOpen: false,
                    categ: '카테고리4',
                }
            }
        })

        this.categs = ['카테고리1', '카테고리2', '카테고리3', '카테고리4']
    }

    public curCateg = '전체'

    public faqDisplayList: Array<FaqListType> = []

    public pageIndexList = []
    public pageNumber = 1
    increasePageNumber() {
        this.pageNumber = this.pageIndexList.length <= this.pageNumber ? this.pageNumber : this.pageNumber + 1
        console.log(
            'increasePageNumber : ',
            this.pageNumber,
            this.pageIndexList.length,
            this.pageIndexList.length >= this.pageNumber
        )
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

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.faqDisplayList = this.faqList
        this.pageNumberInit()
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
