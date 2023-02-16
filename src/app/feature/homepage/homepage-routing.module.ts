import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { HomepageComponent } from './homepage.component'
import { MainComponent } from './main/main.component'
import { FareGuideComponent } from './fare-guide/fare-guide.component'
import { FrequentlyAskedQuestionsComponent } from './frequently-asked-questions/frequently-asked-questions.component'
import { IntroductionInquiryComponent } from './intorduction-inquiry/introduction-inquiry.component'
import { TermsPrivacyPageComponent } from './terms-privacy-page/terms-privacy-page.component'
import { TermsEulaPageComponent } from './terms-eula-page/terms-eula-page.component'
import { NoticeComponent } from './notice/notice.component'
import { CustomerCenterComponent } from './customer-center/customer-center.component'
import { EventComponent } from './event/event.component'
import { UsageGuideComponent } from './usage-guide/usage-guide.component'

const routes: Routes = [
    {
        path: '',
        component: HomepageComponent,
        children: [
            { path: '', component: MainComponent },
            { path: 'fare-guide', component: FareGuideComponent },
            { path: 'introduction-inquiry', component: IntroductionInquiryComponent },
            { path: 'terms-privacy', component: TermsPrivacyPageComponent },
            { path: 'terms-eula', component: TermsEulaPageComponent },
            {
                path: 'customer-center',
                component: CustomerCenterComponent,
                children: [
                    { path: 'notice', component: NoticeComponent },
                    { path: 'event', component: EventComponent },
                    { path: 'usage-guide', component: UsageGuideComponent },
                    { path: 'FAQ', component: FrequentlyAskedQuestionsComponent },
                    { path: '', redirectTo: 'FAQ', component: FrequentlyAskedQuestionsComponent },
                ],
            },
        ],
    },
    { path: 'homepage', redirectTo: '', pathMatch: 'full' },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomepageRoutingModule {}
