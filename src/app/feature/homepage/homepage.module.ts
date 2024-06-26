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
import { IntroductionInquiryComponent } from './intorduction-inquiry/introduction-inquiry.component'
import { FrequentlyAskedQuestionsComponent } from './frequently-asked-questions/frequently-asked-questions.component'
import { TermsPrivacyPageComponent } from './terms-privacy-page/terms-privacy-page.component'
import { TermsEulaPageComponent } from './terms-eula-page/terms-eula-page.component';
import { CustomerCenterComponent } from './customer-center/customer-center.component';
import { NoticeComponent } from './notice/notice.component';
import { EventComponent } from './event/event.component';
import { UsageGuideComponent } from './usage-guide/usage-guide.component'

@NgModule({
    declarations: [
        HomepageComponent,
        MainComponent,
        FareGuideComponent,
        IntroductionInquiryComponent,
        FrequentlyAskedQuestionsComponent,
        TermsPrivacyPageComponent,
        TermsEulaPageComponent,
        CustomerCenterComponent,
        NoticeComponent,
        EventComponent,
        UsageGuideComponent,
    ],
    imports: [CommonModule, HomepageRoutingModule, SharedModule, ComponentsModule, FormsModule, ReactiveFormsModule],
    exports: [],
    providers: [],
})
export class HomepageModule {}
