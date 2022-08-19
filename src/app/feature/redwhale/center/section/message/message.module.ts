import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

import { MessageRoutingModule } from './message-routing.module'

// ngxSkeletonLoader module
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

// components
import { MessageComponent } from './message.component'
import { MemberListComponent } from './components/member-list/member-list.component'
import { TextFieldComponent } from './components/text-field/text-field.component'
import { AutoTransSettingBoxComponent } from './components/auto-trans-setting-box/auto-trans-setting-box.component'
import { MemberListCardComponent } from './components/member-list-card/member-list-card.component'
import { TransmissionHistoryTableComponent } from './components/transmission-history-table/transmission-history-table.component'
import { TransmissionHistoryDateSelectorComponent } from './components/transmission-history-date-selector/transmission-history-date-selector.component'
import { TransmissionHistoryDetailModalComponent } from './components/transmission-history-detail-modal/transmission-history-detail-modal.component'
import { PhoneNumberSelectorComponent } from './components/phone-number-selector/phone-number-selector.component'

// pipes
import { HistoryDatePipe } from './pipes/history-date.pipe'

@NgModule({
    declarations: [
        // components
        MessageComponent,
        MemberListComponent,
        TextFieldComponent,
        AutoTransSettingBoxComponent,
        MemberListCardComponent,
        TransmissionHistoryTableComponent,
        TransmissionHistoryDateSelectorComponent,
        HistoryDatePipe,
        TransmissionHistoryDetailModalComponent,
        PhoneNumberSelectorComponent,
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
