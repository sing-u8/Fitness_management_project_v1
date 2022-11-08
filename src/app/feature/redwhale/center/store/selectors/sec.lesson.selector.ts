import { createSelector } from '@ngrx/store'
import { GymFeature, GymState } from './sec.selector'
import * as FromLesson from '@centerStore/reducers/sec.lesson.reducer'

import _ from 'lodash'
import { Dictionary } from '@ngrx/entity'

export const FeatureKey = 'Center/Lesson'

export const GymLessonFeature = createSelector(GymFeature, (state: GymState) => state[FeatureKey])

export const LessonCategEntities = createSelector(GymLessonFeature, FromLesson.selectLessonCategEntities)

export const LessonAll = createSelector(GymLessonFeature, FromLesson.selectLessonAll)

export const lessonLength = createSelector(GymLessonFeature, FromLesson.getLessonLength)
export const selectedLesson = createSelector(GymLessonFeature, FromLesson.getSelectedLesson)
export const selectedTrainerFilter = createSelector(GymLessonFeature, FromLesson.selectTrainerFilter)
export const trainerFilterList = createSelector(GymLessonFeature, FromLesson.selectTrainerFilterList)
export const currentCenter = createSelector(GymLessonFeature, FromLesson.selectCurrentGym)
export const isLoading = createSelector(GymLessonFeature, FromLesson.selectIsLoading)
export const error = createSelector(GymLessonFeature, FromLesson.selectError)

export const FilteredLessonCategEntities = createSelector(
    LessonCategEntities,
    selectedTrainerFilter,
    (lesCategEntities, trainerFilter) => {
        if (!trainerFilter.value) return lesCategEntities
        const newEntities: Dictionary<FromLesson.LessonCategoryState> = Object.create(Object.prototype)
        _.keys(lesCategEntities).forEach((key) => {
            const copyEntity = _.cloneDeep(lesCategEntities[key])
            copyEntity.items = _.filter(
                copyEntity.items,
                (item) => item.instructors.findIndex((v) => v.id == trainerFilter.value.id) != -1
            )
            newEntities[key] = copyEntity
        })
        return newEntities
    }
)
