import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { SharedModule } from '@shared/shared.module'
import { HomepageHeaderComponent } from './homepage-header/homepage-header.component'
import { ButtonComponent } from './button/button.component'
import { FindMoreButtonComponent } from './find-more-button/find-more-button.component'
import { FunctionBoxComponent } from './function-box/function-box.component'
import { FreeStartFooterComponent } from './free-start-footer/free-start-footer.component'
import { HomepageFooterComponent } from './homepage-footer/homepage-footer.component'
import { FAQListComponent } from './faq-list/faq-list.component'
import { MainCarouselComponent } from './main-carousel/main-carousel.component'

@NgModule({
    declarations: [
        HomepageHeaderComponent,
        ButtonComponent,
        FindMoreButtonComponent,
        FunctionBoxComponent,
        FreeStartFooterComponent,
        HomepageFooterComponent,
        FAQListComponent,
        MainCarouselComponent,
    ],
    imports: [CommonModule, RouterModule, FormsModule, SharedModule],
    exports: [
        HomepageHeaderComponent,
        ButtonComponent,
        FindMoreButtonComponent,
        FunctionBoxComponent,
        FreeStartFooterComponent,
        HomepageFooterComponent,
        FAQListComponent,
        MainCarouselComponent,
    ],
})
export class ComponentsModule {}
