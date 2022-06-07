import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

// components
import { SaleComponent } from './sale.component'
import { SaleDateSelectorComponent } from './components/sale-date-selector/sale-date-selector.component'
import { SaleTableComponent } from './components/sale-table/sale-table.component'
import { SaleSummaryBoxComponent } from './components/sale-summary-box/sale-summary-box.component'

// pipe
import { SaleDatePipe } from './pipes/sale-date.pipe'
import { SaleTableTypePipe } from './pipes/sale-table-type.pipe'
import { SaleTotalPricePipe } from './pipes/sale-total-price.pipe'

// section module
import { CommonModule as SectionCommonModule } from '@redwhale/center/section/common/common.module'

// ngxSkeletonLoader module
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'

@NgModule({
    declarations: [
        // components
        SaleComponent,
        SaleDateSelectorComponent,
        SaleTableComponent,
        SaleSummaryBoxComponent,
        // pipes
        SaleDatePipe,
        SaleTableTypePipe,
        SaleTotalPricePipe,
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
