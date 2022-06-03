import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

// components
import { SaleComponent } from './sale.component'
import { SaleDateSelectorComponent } from './components/sale-date-selector/sale-date-selector.component'

// pipe
import { SaleDatePipe } from './pipes/sale-date.pipe'
import { SaleTableTypePipe } from './pipes/sale-table-type.pipe'

// section module
import { CommonModule as SectionCommonModule } from '@redwhale/center/section/common/common.module'

// ngxSkeletonLoader module
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

@NgModule({
    declarations: [
        // components
        SaleComponent,
        SaleDateSelectorComponent,
        // pipes
        SaleDatePipe,
        SaleTableTypePipe,
    ],
    imports: [
        AngularCommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgxSkeletonLoaderModule,
        SectionCommonModule,
    ],
})
export class SaleModule {}
