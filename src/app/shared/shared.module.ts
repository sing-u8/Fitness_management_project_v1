import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

// Components
import { AvatarComponent } from './components/common/avatar/avatar.component'
import { CheckboxComponent } from './components/common/checkbox/checkbox.component'
import { DatepickerComponent } from './components/common/datepicker/datepicker.component'
import { ModalComponent } from './components/common/modal/modal.component'
import { RadioButtonComponent } from './components/common/radio-button/radio-button.component'
import { SelectComponent } from './components/common/select/select.component'
import { SwitchComponent } from './components/common/switch/switch.component'
import { TimepickerComponent } from './components/common/timepicker/timepicker.component'
import { ToastComponent } from './components/common/toast/toast.component'
import { UploadTaskComponent } from './components/common/upload-task/upload-task.component'
import { Datepicker2Component } from './components/common/datepicker2/datepicker2.component'
import { TimePicker2Component } from './components/common/time-picker2/time-picker2.component'
import { UserSelectComponent } from './components/common/user-select/user-select.component'
import { ColorSelectComponent } from './components/common/color-select/color-select.component'
import { DualNavigationComponent } from './components/common/dual-navigation/dual-navigation.component'
import { EmptyIndicatorComponent } from './components/common/empty-indicator/empty-indicator.component'
import { ButtonComponent } from './components/common/button/button.component'
import { TermsEULAComponent } from './components/terms/terms-eula/terms-eula.component'
import { TermsPrivacyComponent } from './components/terms/terms-privacy/terms-privacy.component'
import { SmallModalComponent } from './components/common/small-modal/small-modal.component'
import { MemberListModalComponent } from './components/common/member-list-modal/member-list-modal.component'
import { ChargeModalComponent } from './components/common/charge-modal/charge-modal.component'
import { DatepickModalComponent } from './components/common/datepick-modal/datepick-modal.component'
import { DbDatepickerComponent } from './components/common/db-datepicker/db-datepicker.component'

// - //
import { LessonFlipListComponent } from './components/redwhale/drawer/lesson-flip-list/lesson-flip-list.component'
import { DrawerLessonCardComponent } from './components/redwhale/drawer/drawer-lesson-card/drawer-lesson-card.component'
import { DwMembershipListModalComponent } from './components/redwhale/drawer/dw-membership-list-modal/dw-membership-list-modal.component'
import { DrawerModifyLessonCardComponent } from './components/redwhale/drawer/drawer-modify-lesson-card/drawer-modify-lesson-card.component'

// - //
import { SchDayRepeatSelectComponent } from './components/redwhale/schedule/sch-day-repeat-select/sch-day-repeat-select.component'

// Directives
// import { AutoScrollDirective } from './directives/auto-scroll.directive'
import { ButtonDirective } from './directives/button.directive'
import { ClickOutsideDirective } from './directives/click-outside.directive'
import { DropzoneDirective } from './directives/dropzone.directive'
import { HighlightDirective } from './directives/highlight.directive'
import { InputDirective } from './directives/input.directive'
import { TooltipDirective } from './directives/tooltip.directive'
import { AutoFocusDirective } from './directives/auto-focus.directive'
import { TextareaAutoResize } from './directives/textarea-auto-resize.directive'
import { Dropzone2Directive } from './directives/dropzone2.directive'
import { EllipsisDropdownDirective } from './directives/ellipsis-dropdown.directive'

// Pipes
import { LinkPipe } from './pipes/link.pipe'
import { MinuteSecondsPipe } from './pipes/minuteSeconds.pipe'
import { numberWithCommasPipe } from './pipes/numberWithCommas.pipe'
import { SafePipe } from './pipes/safe.pipe'
import { TimePipe } from './pipes/time.pipe'
import { PhoneNumberPipe } from './pipes/phone-number.pipe'
import { DashToDotPipe } from './pipes/dash-to-dot.pipe'
import { AbsNumberPipe } from './pipes/abs-number.pipe'
import { DayDiffPipe } from './pipes/day-diff.pipe'
import { RateOfChangePipe } from './pipes/rate-of-change.pipe'
import { DateFormatPipe } from './pipes/date-format.pipe'
import { BirthDatePipe } from './pipes/birth-date.pipe'
import { WordEllipsisPipe } from './pipes/word-ellipsis.pipe'
import { TrimTextPipe } from './pipes/trim-text.pipe'
import { FilesizePipe } from './pipes/filesize.pipe'
import { PeriodPipe } from './pipes/period.pipe'
import { RestPeriodPipe } from './pipes/rest-period.pipe'

// Dragula
// import { DragulaModule } from 'ng2-dragula'

// FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'

// Angular-Gridster2
import { GridsterModule } from 'angular-gridster2'

// // ngx libraries
// import { NgxGaugeModule } from 'ngx-gauge'
import { NgxSpinnerModule } from 'ngx-spinner'

// import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

// module for each feature

FullCalendarModule.registerPlugins([
    dayGridPlugin,
    timeGridPlugin,
    listPlugin,
    interactionPlugin,
    resourceTimeGridPlugin,
])

@NgModule({
    declarations: [
        AvatarComponent,
        CheckboxComponent,
        DatepickerComponent,
        ModalComponent,
        RadioButtonComponent,
        SelectComponent,
        SwitchComponent,
        TimepickerComponent,
        ToastComponent,
        UploadTaskComponent,
        Datepicker2Component,
        TimePicker2Component,
        UserSelectComponent,
        ColorSelectComponent,
        DualNavigationComponent,
        EmptyIndicatorComponent,
        ButtonComponent,
        TermsEULAComponent,
        TermsPrivacyComponent,
        SmallModalComponent,
        MemberListModalComponent,
        LessonFlipListComponent,
        DrawerLessonCardComponent,
        SchDayRepeatSelectComponent,
        DwMembershipListModalComponent,
        DrawerModifyLessonCardComponent,
        ChargeModalComponent,
        DatepickModalComponent,
        DbDatepickerComponent,
        // Directives
        // AutoScrollDirective,
        ButtonDirective,
        ClickOutsideDirective,
        DropzoneDirective,
        HighlightDirective,
        InputDirective,
        TooltipDirective,
        AutoFocusDirective,
        TextareaAutoResize,
        Dropzone2Directive,
        EllipsisDropdownDirective,
        // Pipes
        LinkPipe,
        MinuteSecondsPipe,
        numberWithCommasPipe,
        SafePipe,
        TimePipe,
        PhoneNumberPipe,
        DashToDotPipe,
        AbsNumberPipe,
        DayDiffPipe,
        RateOfChangePipe,
        DateFormatPipe,
        BirthDatePipe,
        WordEllipsisPipe,
        TrimTextPipe,
        FilesizePipe,
        PeriodPipe,
        RestPeriodPipe,
    ],
    imports: [
        CommonModule,
        FormsModule,
        // DragulaModule.forRoot(),
        GridsterModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
    ],
    exports: [
        AvatarComponent,
        CheckboxComponent,
        DatepickerComponent,
        ModalComponent,
        RadioButtonComponent,
        SelectComponent,
        SwitchComponent,
        TimepickerComponent,
        ToastComponent,
        UploadTaskComponent,
        Datepicker2Component,
        TimePicker2Component,
        UserSelectComponent,
        ColorSelectComponent,
        DualNavigationComponent,
        EmptyIndicatorComponent,
        ButtonComponent,
        TermsEULAComponent,
        TermsPrivacyComponent,
        SmallModalComponent,
        MemberListModalComponent,
        LessonFlipListComponent,
        DrawerLessonCardComponent,
        SchDayRepeatSelectComponent,
        DwMembershipListModalComponent,
        DrawerModifyLessonCardComponent,
        ChargeModalComponent,
        DatepickModalComponent,
        DbDatepickerComponent,
        // Directives
        // AutoScrollDirective,
        ButtonDirective,
        ClickOutsideDirective,
        DropzoneDirective,
        HighlightDirective,
        InputDirective,
        TooltipDirective,
        AutoFocusDirective,
        TextareaAutoResize,
        Dropzone2Directive,
        EllipsisDropdownDirective,
        // Pipes
        LinkPipe,
        MinuteSecondsPipe,
        numberWithCommasPipe,
        SafePipe,
        TimePipe,
        PhoneNumberPipe,
        DashToDotPipe,
        AbsNumberPipe,
        DayDiffPipe,
        RateOfChangePipe,
        DateFormatPipe,
        BirthDatePipe,
        WordEllipsisPipe,
        TrimTextPipe,
        FilesizePipe,
        PeriodPipe,
        RestPeriodPipe,

        // FullCalendar
        FullCalendarModule,
        // Angular-Gridstar2
        GridsterModule,
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
