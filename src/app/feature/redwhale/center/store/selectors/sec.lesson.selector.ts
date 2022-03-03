import { createSelector } from '@ngrx/store'
import { GymFeature, GymState } from './sec.selector'
import * as FromLesson from '@centerStore/reducers/sec.lesson.reducer'

import * as _ from 'lodash'
import { Dictionary } from '@ngrx/entity'

export const FeatureKey = 'Gym/Lesson'

export const GymLessonFature = createSelector(GymFeature, (state: GymState) => state[FeatureKey])

export const LessonCategEntities = createSelector(GymLessonFature, FromLesson.selectLessonCategEntities)

export const LessonAll = createSelector(GymLessonFature, FromLesson.selectLessonAll)

export const lessonCategLength = createSelector(GymLessonFature, FromLesson.getLessonCategLength)
export const selectedLesson = createSelector(GymLessonFature, FromLesson.getSelectedLesson)
export const seletedTrainerFilter = createSelector(GymLessonFature, FromLesson.selectTrainerFilter)
export const trainerFilterList = createSelector(GymLessonFature, FromLesson.selectTrainerFilterList)
export const currentCenter = createSelector(GymLessonFature, FromLesson.selectCurrentGym)
export const isLoading = createSelector(GymLessonFature, FromLesson.selectIsLoading)
export const error = createSelector(GymLessonFature, FromLesson.selectError)

export const FilteredLessonCategEntities = createSelector(
    LessonCategEntities,
    seletedTrainerFilter,
    (lesCategEntities, trainerFilter) => {
        if (!trainerFilter.value) return lesCategEntities
        const newEntities: Dictionary<FromLesson.LessonCategoryState> = Object.create(Object.prototype)
        _.keys(lesCategEntities).forEach((key) => {
            const copyEntity = _.cloneDeep(lesCategEntities[key])
            copyEntity.items = _.filter(copyEntity.items, (item) => item.instructor.id == trainerFilter.value.id)
            newEntities[key] = copyEntity
        })
        return newEntities
    }
)
