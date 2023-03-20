import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
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
import { ChargeModalComponent } from './components/common/charge-modal/charge-modal.component'
import { DatepickModalComponent } from './components/common/datepick-modal/datepick-modal.component'
import { DbDatepickerComponent } from './components/common/db-datepicker/db-datepicker.component'
import { RolemodalComponent } from './components/common/rolemodal/rolemodal.component'
import { CenterRolemodalComponent } from './components/common/center-rolemodal/center-rolemodal.component'
import { SignaturePadModalComponent } from './components/common/signature-pad-modal/signature-pad-modal.component'
import { SettingTermsModalComponent } from './components/common/setting-terms-modal/setting-terms-modal.component'
import { AttendanceToastComponent } from './components/common/attendance-toast/attendance-toast.component'
import { MultiUserSelectComponent } from './components/common/multi-user-select/multi-user-select.component'
import { ComponentToastComponent } from './components/common/component-toast/component-toast.component'
import { SettingNoticeModalComponent } from './components/common/setting-notice-modal/setting-notice-modal.component'
import { NoticeModalComponent } from './components/common/notice-modal/notice-modal.component'
import { IntroGuideToastComponent } from './components/common/intro-guide-toast/intro-guide-toast.component'
import { KakaoChannelButtonComponent } from './components/common/kakao-channel-button/kakao-channel-button.component'

// -drawer- //
import { LessonFlipListComponent } from './components/redwhale/drawer/lesson-flip-list/lesson-flip-list.component'
import { DrawerLessonCardComponent } from './components/redwhale/drawer/drawer-lesson-card/drawer-lesson-card.component'
import { DwMembershipListModalComponent } from './components/redwhale/drawer/dw-membership-list-modal/dw-membership-list-modal.component'
import { DrawerModifyLessonCardComponent } from './components/redwhale/drawer/drawer-modify-lesson-card/drawer-modify-lesson-card.component'
import { DwChattingRoomSelectComponent } from './components/redwhale/drawer/dw-chatting-room-select/dw-chatting-room-select.component'
// -schedule- //
import { SchDayRepeatSelectComponent } from './components/redwhale/schedule/sch-day-repeat-select/sch-day-repeat-select.component'

// -community- //
import { MultiAvatarComponent } from './components/redwhale/community/multi-avatar/multi-avatar.component'
import { InviteRoomModalComponent } from './components/redwhale/community/invite-room-modal/invite-room-modal.component'
import { DragGuideComponent } from './components/redwhale/community/drag-guide/drag-guide.component'
import { ChatRoomListDropdownComponent } from './components/redwhale/community/chat-room-list-dropdown/chat-room-list-dropdown.component'
import { ChatMessageUserComponent } from './components/redwhale/community/chat-message-user/chat-message-user.component'
import { ChatMessageComponent } from './components/redwhale/community/chat-message/chat-message.component'
import { ChatIntroMessageComponent } from './components/redwhale/community/chat-intro-message/chat-intro-message.component'
import { ChattingRoomCardComponent } from './components/redwhale/community/chatting-room-card/chatting-room-card.component'

// -payment- //
import { PaymentItemComponent } from './components/payment/payment-item/payment-item.component'

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
import { ContenteditableDirective } from './directives/contenteditable.directive'
import { TextareaHeightResizeDirective } from './directives/textarea-height-resize.directive'
import { TextareaInfiniteResizeDirective } from './directives/textarea-infinite-resize.directive'
import { SeeDetailDirective } from './directives/see-detail.directive'

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
import { IsAfterPipe } from './pipes/isAfter.pipe'
import { CallbackPipe } from './pipes/callback.pipe'
import { IsTodayPipe } from './pipes/is-today.pipe'
import { FilterZeroPaymentPipe } from './pipes/filter-zero-payment.pipe'
import { NameEllipsisPipe } from './pipes/name-ellipsis.pipe'
import { ChatRoomNamePipe } from './pipes/chat-room-name.pipe'

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
// ng2-dragular
import { DragulaModule } from 'ng2-dragula'

// Angular signature
// // ngx libraries
import { NgxGaugeModule } from 'ngx-gauge'
import { NgxSpinnerModule } from 'ngx-spinner'
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

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
        LessonFlipListComponent,
        RolemodalComponent,
        CenterRolemodalComponent,
        SignaturePadModalComponent,
        SettingTermsModalComponent,
        AttendanceToastComponent,
        MultiUserSelectComponent,
        ComponentToastComponent,
        SettingNoticeModalComponent,
        NoticeModalComponent,
        IntroGuideToastComponent,
        KakaoChannelButtonComponent,
        PaymentItemComponent,
        // -- //drawer
        DrawerLessonCardComponent,
        SchDayRepeatSelectComponent,
        DwMembershipListModalComponent,
        DrawerModifyLessonCardComponent,
        ChargeModalComponent,
        DatepickModalComponent,
        DwChattingRoomSelectComponent,
        // -- //schedule
        DbDatepickerComponent,
        // -- //community
        MultiAvatarComponent,
        InviteRoomModalComponent,
        DragGuideComponent,
        ChatRoomListDropdownComponent,
        ChatMessageUserComponent,
        ChatMessageComponent,
        ChatIntroMessageComponent,
        ChattingRoomCardComponent,
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
        ContenteditableDirective,
        TextareaHeightResizeDirective,
        TextareaInfiniteResizeDirective,
        SeeDetailDirective,
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
        IsAfterPipe,
        CallbackPipe,
        IsTodayPipe,
        ContenteditableDirective,
        FilterZeroPaymentPipe,
        NameEllipsisPipe,
        ChatRoomNamePipe,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgxGaugeModule,
        GridsterModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        NgxSkeletonLoaderModule,
        DragulaModule.forRoot(),
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
        LessonFlipListComponent,
        RolemodalComponent,
        CenterRolemodalComponent,
        SignaturePadModalComponent,
        SettingTermsModalComponent,
        AttendanceToastComponent,
        MultiUserSelectComponent,
        ComponentToastComponent,
        SettingNoticeModalComponent,
        IntroGuideToastComponent,
        KakaoChannelButtonComponent,
        PaymentItemComponent,
        // -- //drawer
        DrawerLessonCardComponent,
        SchDayRepeatSelectComponent,
        DwMembershipListModalComponent,
        DrawerModifyLessonCardComponent,
        ChargeModalComponent,
        DatepickModalComponent,
        DwChattingRoomSelectComponent,
        NoticeModalComponent,
        // -- //schedule
        DbDatepickerComponent,
        // -- //community
        MultiAvatarComponent,
        InviteRoomModalComponent,
        DragGuideComponent,
        ChatRoomListDropdownComponent,
        ChatMessageUserComponent,
        ChatMessageComponent,
        ChatIntroMessageComponent,
        ChattingRoomCardComponent,
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
        ContenteditableDirective,
        TextareaHeightResizeDirective,
        TextareaInfiniteResizeDirective,
        SeeDetailDirective,
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
        IsAfterPipe,
        CallbackPipe,
        IsTodayPipe,
        FilterZeroPaymentPipe,
        NameEllipsisPipe,
        ChatRoomNamePipe,
        // FullCalendar
        FullCalendarModule,
        // Angular-Gridstar2
        GridsterModule,
        DragulaModule,
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
