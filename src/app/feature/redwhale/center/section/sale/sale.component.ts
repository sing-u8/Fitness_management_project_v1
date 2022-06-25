import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, ViewChild, ElementRef } from '@angular/core'
import _ from 'lodash'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
import { Subscription } from 'rxjs'

import { Center } from '@schemas/center'
import { StatsSales } from '@schemas/stats-sales'
import { modalData } from './components/setting-show-sale-modal/setting-show-sale-modal.component'

import { StorageService } from '@services/storage.service'
import { getStatsSaleOption } from '@services/center-stats.service'

// rxjs
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// ngrx and store
import { Store, select } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

import * as FromSale from '@centerStore/reducers/sec.sale.reducer'
import * as SaleSelector from '@centerStore/selectors/sec.sale.selector'
import * as SaleActions from '@centerStore/actions/sec.sale.actions'

@Component({
    selector: 'sale',
    templateUrl: './sale.component.html',
    styleUrls: ['./sale.component.scss'],
})
export class SaleComponent implements OnInit, OnDestroy {
    // ngrx vars
    public saleData$ = this.nxStore.select(SaleSelector.saleData)
    public saleStatistics$ = this.nxStore.select(SaleSelector.saleStatistics)
    // ngrx copy vars
    public unsubscriber$ = new Subject<void>()
    public selectedDate: FromSale.SelectedDate
    public isFiltered: FromSale.IsFiltered
    public typeCheck: FromSale.TypeCheck
    public productCheck: FromSale.ProductCheck
    public inputs: FromSale.Inputs
    //

    public showEmptyTableFlag: 'register' | 'reFilter' | 'none'
    // public isFiltered: Record<Filters, boolean>
    public isFilteredSubscription: Subscription
    public filterTagList: Array<{
        query: string
        queryCateg: string
        type: string
        value: string
        cancelFn: () => void
    }>

    public center: Center
    public tableOption: getStatsSaleOption

    public resizeUnlistener: () => void
    @ViewChild('sale') sale: ElementRef

    constructor(private renderer: Renderer2, private nxStore: Store, private storageService: StorageService) {
        this.showEmptyTableFlag = 'none'
        this.filterTagList = []
        this.center = this.storageService.getCenter()

        this.nxStore
            .pipe(select(SaleSelector.selectedDate), takeUntil(this.unsubscriber$))
            .subscribe((selectedDate) => {
                this.selectedDate = _.cloneDeep(selectedDate)
            })
        this.nxStore.pipe(select(SaleSelector.typeCheck), takeUntil(this.unsubscriber$)).subscribe((typeCheck) => {
            this.typeCheck = _.cloneDeep(typeCheck)
        })
        this.nxStore
            .pipe(select(SaleSelector.productCheck), takeUntil(this.unsubscriber$))
            .subscribe((productCheck) => {
                this.productCheck = _.cloneDeep(productCheck)
            })
        this.nxStore.pipe(select(SaleSelector.inputs), takeUntil(this.unsubscriber$)).subscribe((inputs) => {
            this.inputs = _.cloneDeep(inputs)
        })
        this.selectIsFiltered()
    }

    ngOnInit(): void {}
    ngOnDestroy(): void {
        // this.isFilteredSubscription.unsubscribe()
        this.unsubscriber$.next()
        this.unsubscriber$.complete()
        // this.resizeUnlistener()
    }

    ngAfterViewInit(): void {
        // this.resizeUnlistener = this.renderer.listen('window', 'resize', (event) => {
        //     if (event.target.innerWidth >= 1180 && event.target.innerWidth <= 1440) {
        //         this.renderer.setStyle(this.sale.nativeElement, 'minWidth', `${event.target.innerWidth - 64}px`)
        //     }
        // })
    }
    // setting show sale vars and funcs
    public settingShowSaleData: modalData = {
        text: '매출 공개 여부를 설정해주세요.',
        subText: `비공개 시, 운영자와 관리자에게만 매출 페이지가 보여지며
                    공개 시, 강사에게도 매출 페이지가 공개돼요.`,
        cancelButtonText: '취소',
        confirmButtonText: '저장하기',
    }

    // ! 이후에 API로 수정 필요
    public showSale = true
    public doSettingShowSaleModal = false
    openSettingShowSaleModal() {
        this.doSettingShowSaleModal = true
        console.log('openSettingShowSaleModal : ', this.showSale)
    }
    onSettingShowSaleModalCancel() {
        this.doSettingShowSaleModal = false
    }
    onSettingShowSaleModalConfirm(Return: boolean) {
        this.doSettingShowSaleModal = false
        console.log('onSettingShowSaleModalConfirm : ', Return, this.showSale)
    }

    // sale-date-selector vars and funcs
    onDateSeleted(date: FromSale.SelectedDate) {
        this.nxStore.dispatch(SaleActions.setSelectedDate({ selectedDate: date }))
        this.selectedDate = date
        this.getSaleTableWrpper(this.selectedDate, this.tableOption)
        this.nxStore.dispatch(showToast({ text: '매출 조회 기간이 변경되었습니다.' }))
    }

    // sale isFiltered vars and func
    selectIsFiltered() {
        this.nxStore.pipe(select(SaleSelector.isFiltered), takeUntil(this.unsubscriber$)).subscribe((_isFiltered) => {
            console.log('select is filtered : ', _isFiltered)
            // make filter tag list
            _.forEach(_.keys(_isFiltered), (filterType) => {
                if (filterType == 'type') {
                    if (_isFiltered[filterType] == true) {
                        // when type flag = true
                        const index = _.findIndex(this.filterTagList, {
                            type: this.filterMatcher(filterType),
                        })
                        index == -1
                            ? this.filterTagList.push(this.makeTypeTagObj())
                            : (this.filterTagList[index] = this.makeTypeTagObj())
                    } else {
                        // when type flag = false
                        _.remove(this.filterTagList, (item) => item.type === this.filterMatcher(filterType))
                    }
                } else if (filterType == 'product') {
                    if (_isFiltered[filterType] == true) {
                        // when type flag = true
                        const index = _.findIndex(this.filterTagList, {
                            type: this.filterMatcher(filterType),
                        })
                        console.log('product index :: ', index, this.filterTagList)
                        index == -1
                            ? this.filterTagList.push(this.makeProductTagObj())
                            : (this.filterTagList[index] = this.makeProductTagObj())
                    } else {
                        // when type flag = false
                        _.remove(this.filterTagList, (item) => item.type === this.filterMatcher(filterType))
                    }
                } else if (filterType != 'type') {
                    if (_isFiltered[filterType] == true) {
                        const index = _.findIndex(this.filterTagList, {
                            type: this.filterMatcher(filterType as FromSale.Filters),
                        })

                        index == -1
                            ? this.filterTagList.push(this.makeInputTagObj(filterType as FromSale.InputString))
                            : (this.filterTagList[index] = this.makeInputTagObj(filterType as FromSale.InputString))
                    } else {
                        _.remove(
                            this.filterTagList,
                            (item) => item.type === this.filterMatcher(filterType as FromSale.Filters)
                        )
                    }
                }
            })

            console.log('table option -- ', this.filterTagList)
            this.makeTableOption()
            console.log('selectIsFiltered --- ', this.tableOption, ', ', this.filterTagList)
            // this.tableOption = _.keys(this.tableOption).length > 0 ? this.tableOption : undefined
            this.getSaleTableWrpper(this.selectedDate, this.tableOption)
        })
    }

    // filter option method
    makeTableOption() {
        this.tableOption = _.reduce(
            this.filterTagList,
            (obj, item) => {
                if (item.queryCateg == 'product_type_code') {
                    const props = _.map(_.split(item.query, '|'), (v) => 'user_' + v)
                    return {
                        ...obj,
                        [item.queryCateg]: props,
                    }
                } else if (item.queryCateg == 'type_code') {
                    const props = _.map(_.split(item.query, '|'), (v) => 'payment_type_' + v)
                    return {
                        ...obj,
                        [item.queryCateg]: props,
                    }
                } else {
                    return {
                        ...obj,
                        [item.queryCateg]: item.query,
                    }
                }
            },
            {}
        )
    }

    // filter tag method

    makeTypeTagObj() {
        const type = this.filterMatcher('type')
        const category = this.queryMatcher('type')
        let value = ''
        let query = ''

        _.forEach(_.keys(this.typeCheck), (key) => {
            if (this.typeCheck[key]) {
                value = value + this.typeMatcher(key as FromSale.TypeCheckString) + ', '
                query = query + key + '|' // %7C
            }
        })
        value = _.trimEnd(value, ', ')
        query = _.trimEnd(query, '|')
        return {
            query: query,
            queryCateg: category,
            type: type,
            value: value,
            cancelFn: () => {
                this.nxStore.dispatch(SaleActions.resetTypeCheck())
                this.nxStore.dispatch(
                    SaleActions.setIsFiltered({
                        newState: {
                            type: false,
                        },
                    })
                )
            },
        }
    }
    makeProductTagObj() {
        const type = this.filterMatcher('product')
        const category = this.queryMatcher('product')
        let value = ''
        let query = ''

        _.forEach(_.keys(this.productCheck), (key) => {
            if (this.productCheck[key]) {
                value = value + this.productMatcher(key as FromSale.ProductCheckString) + ', '
                query = query + key + '|' // %7C
            }
        })
        value = _.trimEnd(value, ', ')
        query = _.trimEnd(query, '|')
        return {
            query: query,
            queryCateg: category,
            type: type,
            value: value,
            cancelFn: () => {
                this.nxStore.dispatch(SaleActions.resetProductCheck())
                this.nxStore.dispatch(
                    SaleActions.setIsFiltered({
                        newState: {
                            product: false,
                        },
                    })
                )
            },
        }
    }
    makeInputTagObj(filterType: FromSale.InputString) {
        const type = this.filterMatcher(filterType)
        const category = this.queryMatcher(filterType)
        const value = this.inputs[filterType]
        return {
            query: value,
            queryCateg: category,
            type: type,
            value: value,
            cancelFn: () => {
                this.nxStore.dispatch(SaleActions.resetInputs())
                this.nxStore.dispatch(SaleActions.setIsFiltered({ newState: { [filterType]: false } }))
            },
        }
    }

    // date input format  YYYY-MM-DD: 10개  or YYYY-MM: 7개
    getSaleTable(startDate: string, endDate?: string, option?: getStatsSaleOption) {
        let start = startDate
        let end = endDate
        if (!endDate) {
            const dateList = _.map(_.split(startDate, '.'), _.parseInt)
            if (dateList.length == 2) {
                start = dayjs(new Date(dateList[0], dateList[1] - 1, 1)).format('YYYY-MM-DD')
                end = dayjs(new Date(dateList[0], dateList[1], 0)).format('YYYY-MM-DD')
                this.showEmptyTableFlag = dayjs(`${dateList[0]}-${dateList[1]}`).isSame(
                    dayjs().format('YYYY-MM'),
                    'month'
                )
                    ? 'register'
                    : 'reFilter'
            } else if (dateList.length == 3) {
                start = dayjs(new Date(dateList[0], dateList[1] - 1, dateList[2])).format('YYYY-MM-DD')
                end = dayjs(new Date(dateList[0], dateList[1] - 1, dateList[2])).format('YYYY-MM-DD')
                this.showEmptyTableFlag = dayjs(`${dateList[0]}-${dateList[1]}-${dateList[2]}`).isSame(
                    dayjs().format('YYYY-MM-DD'),
                    'day'
                )
                    ? 'register'
                    : 'reFilter'
            }
        } else {
            const _startDateList = _.map(_.split(startDate, '.'), _.parseInt)
            start = dayjs(new Date(_startDateList[0], _startDateList[1] - 1, _startDateList[2])).format('YYYY-MM-DD')
            const _endDateList = _.map(_.split(endDate, '.'), _.parseInt)
            end = dayjs(new Date(_endDateList[0], _endDateList[1] - 1, _endDateList[2])).format('YYYY-MM-DD')
            const startDateList = _.split(startDate, '.')
            const endtDateList = _.split(endDate, '.')
            this.showEmptyTableFlag = dayjs(dayjs().format('YYYY-MM-DD')).isBetween(
                `${startDateList[0]}-${startDateList[1]}-${startDateList[2]}`,
                `${endtDateList[0]}-${endtDateList[1]}-${endtDateList[2]}`,
                'day',
                '[]'
            )
                ? 'register'
                : 'reFilter'
        }

        console.log('getSaleTable - start, end : ', start, end)

        this.callGetSaleTable(start, end, option)
    }
    callGetSaleTable(start: string, end: string, option?: getStatsSaleOption) {
        console.log('callGetSaleTable -- options : ', option)
        this.nxStore.dispatch(
            SaleActions.startGetSaleData({ centerId: this.center.id, start_date: start, end_date: end, option: option })
        )
    }

    // date helper methods
    getSaleTableWrpper(_selectedDate: FromSale.SelectedDate, option?: getStatsSaleOption) {
        if (_.isArray(_selectedDate)) {
            this.getSaleTable(_selectedDate[0], _selectedDate[1], option)
        } else if (_.isString(_selectedDate)) {
            this.getSaleTable(_selectedDate, '', option)
        }
    }

    // helpers
    typeMatcher(type: FromSale.TypeCheckString) {
        switch (type) {
            case 'payment':
                return '결제'
            case 'refund':
                return '환불'
            case 'transfer':
                return '양도'
        }
    }

    productMatcher(type: FromSale.ProductCheckString) {
        switch (type) {
            case 'locker':
                return '락커'
            case 'membership':
                return '회원권'
        }
    }

    filterMatcher(filter: FromSale.Filters) {
        switch (filter) {
            case 'member':
                return '회원명'
            case 'membershipLocker':
                return '회원권/락커명'
            case 'personInCharge':
                return '결제 담당자'
            case 'type':
                return '구분'
            case 'product':
                return '상품'
        }
    }

    queryMatcher(filter: FromSale.Filters) {
        switch (filter) {
            case 'member':
                return 'center_user_name'
            case 'membershipLocker':
                return 'product_name'
            case 'personInCharge':
                return 'responsibility_user_name'
            case 'type':
                return 'type_code'
            case 'product':
                return 'product_type_code'
        }
    }
}
