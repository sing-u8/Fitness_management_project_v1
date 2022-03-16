import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from '@shared/shared.module'

import { HomepageRoutingModule } from './homepage-routing.module'
import { ComponentsModule } from './components/components.module'

// components
import { HomepageComponent } from './homepage.component'
import { MainComponent } from './main/main.component'
import { FareGuideComponent } from './fare-guide/fare-guide.component'
import { IntorductionInquiryComponent } from './intorduction-inquiry/intorduction-inquiry.component'
import { FrequentlyAskedQuestionsComponent } from './frequently-asked-questions/frequently-asked-questions.component'

@NgModule({
    declarations: [
        HomepageComponent,
        MainComponent,
        FareGuideComponent,
        IntorductionInquiryComponent,
        FrequentlyAskedQuestionsComponent,
    ],
    imports: [CommonModule, HomepageRoutingModule, SharedModule, ComponentsModule, FormsModule, ReactiveFormsModule],
    exports: [],
    providers: [],
})
export class HomepageModule {}
