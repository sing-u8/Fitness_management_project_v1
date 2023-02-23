import { Injectable } from '@angular/core'

import { Center } from '@schemas/center'
import dayjs from 'dayjs'
import _ from 'lodash'

@Injectable({
    providedIn: 'root',
})
export class FreeTrialHelperService {
    public freeTrialPeriodTagObj = {
        in_free_trial: '⏳ 무료 체험 종료 ',
        on_free_trial_end: '⏳ 오늘 무료 체험이 종료돼요!',
        free_trial_end: '⛔ 무료 체험이 종료되었어요.',
    }
    public subscriptionPeriodTagObj = {
        in_use: '⏳ 이용권 만료 7일 전',
        on_use_end: '⏳ 오늘 이용권이 만료돼요!',
        use_end: '⛔ 이용권이 만료되었어요.',
    }

    public freeTrialPeriodHeaderTextObj = {
        in_free_trial: {
            first: '⏳ ',
            second: '일 후에 무료 체험이 종료돼요.',
        },
        on_free_trial_end: '⏳ 오늘 무료 체험이 종료돼요!',
        free_trial_end: {
            first: '⛔ 무료 체험이 종료되어 ',
            second: '일 후부터 모든 기능을 사용하실 수 없어요.',
        },
    }
    public subscriptionPeriodHeaderTextObj = {
        start_count: {
            start: '⏳ ',
            second: '일 후에 이용권이 만료돼요.',
        },
        end_soon: '⏳ 오늘 이용권이 만료돼요!',
        end: {
            start: '⛔ 이용권이 만료되어 ',
            second: '일 후부터 모든 기능을 사용하실 수 없어요.',
        },
    }
    constructor() {}

    getPeriodAlertTag(center: Center) {
        if (_.isEmpty(center)) return ''
        const endTrialDate = dayjs(center.free_trial_end_date).subtract(3, 'day')
        console.log('getPeriodAlertTag : ', center, center.name, dayjs(endTrialDate).format('YYYY-MM-DD'))
        if (dayjs(dayjs().format('YYYY-MM-DD')).isBefore(endTrialDate, 'day')) {
            return (
                this.freeTrialPeriodTagObj.in_free_trial +
                dayjs(endTrialDate).diff(dayjs().format('YYYY-MM-DD'), 'day') +
                '일 전'
            )
        } else if (dayjs(dayjs().format('YYYY-MM-DD')).isSame(endTrialDate, 'day')) {
            return this.freeTrialPeriodTagObj.on_free_trial_end
        } else if (dayjs(dayjs().format('YYYY-MM-DD')).isAfter(endTrialDate)) {
            return this.freeTrialPeriodTagObj.free_trial_end
        } else {
            return ''
        }
    }

    getHeaderPeriodAlertText(center: Center) {
        if (_.isEmpty(center)) return ''
        const endTrialDate = dayjs(center.free_trial_end_date).subtract(3, 'day')
        if (dayjs(dayjs().format('YYYY-MM-DD')).isBefore(endTrialDate, 'day')) {
            return (
                this.freeTrialPeriodHeaderTextObj.in_free_trial.first +
                dayjs(endTrialDate).diff(dayjs().format('YYYY-MM-DD'), 'day') +
                this.freeTrialPeriodHeaderTextObj.in_free_trial.second
            )
        } else if (dayjs(dayjs().format('YYYY-MM-DD')).isSame(endTrialDate, 'day')) {
            return this.freeTrialPeriodHeaderTextObj.on_free_trial_end
        } else if (
            dayjs(dayjs().format('YYYY-MM-DD')).isBetween(
                endTrialDate,
                dayjs(center.free_trial_end_date).format('YYYY-MM-DD'),
                'day',
                '[)'
            )
        ) {
            return (
                this.freeTrialPeriodHeaderTextObj.free_trial_end.first +
                dayjs(dayjs(center.free_trial_end_date)).diff(dayjs().format('YYYY-MM-DD'), 'day') +
                this.freeTrialPeriodHeaderTextObj.free_trial_end.second
            )
        } else {
            return ''
        }
    }

    isSubscriptionOver(center: Center): {
        freeTrial: boolean
        subscription: boolean
    } {
        console.log('is subscription over : ', center)
        if (_.isEmpty(center)) {
            return {
                freeTrial: false,
                subscription: false,
            }
        }

        if (dayjs(dayjs().format('YYYY-MM-DD')).isAfter(dayjs(center.free_trial_end_date).format('YYYY-MM-DD'))) {
            return {
                freeTrial: true,
                subscription: false,
            }
        } else {
            return {
                freeTrial: false,
                subscription: false,
            }
        }
    }
}
