import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

import { MessageRoutingModule } from './message-routing.module'

// ngxSkeletonLoader module
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

// components
import { MessageComponent } from './message.component'
import { MsgMemberListComponent } from './components/msg-member-list/msg-member-list.component'
import { TextFieldComponent } from './components/text-field/text-field.component'
import { AutoTransSettingBoxComponent } from './components/auto-trans-setting-box/auto-trans-setting-box.component'
import { MsgMemberListCardComponent } from './components/msg-member-list-card/msg-member-list-card.component'
import { TransmissionHistoryTableComponent } from './components/transmission-history-table/transmission-history-table.component'
import { TransmissionHistoryDateSelectorComponent } from './components/transmission-history-date-selector/transmission-history-date-selector.component'
import { TransmissionHistoryDetailModalComponent } from './components/transmission-history-detail-modal/transmission-history-detail-modal.component'
import { PhoneNumberSelectorComponent } from './components/phone-number-selector/phone-number-selector.component'

// pipes
import { HistoryDatePipe } from './pipes/history-date.pipe';
import { MsgUserListSelectComponent } from './components/msg-user-list-select/msg-user-list-select.component'

@NgModule({
    declarations: [
        // components
        MessageComponent,
        MsgMemberListComponent,
        TextFieldComponent,
        AutoTransSettingBoxComponent,
        MsgMemberListCardComponent,
        TransmissionHistoryTableComponent,
        TransmissionHistoryDateSelectorComponent,
        HistoryDatePipe,
        TransmissionHistoryDetailModalComponent,
        PhoneNumberSelectorComponent,
        MsgUserListSelectComponent,
    ],
    imports: [
        MessageRoutingModule,
        AngularCommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgxSkeletonLoaderModule,
    ],
})
export class MessageModule {}
