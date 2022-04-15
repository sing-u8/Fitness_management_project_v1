import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { HomepageComponent } from './homepage.component'
import { MainComponent } from './main/main.component'
import { FareGuideComponent } from './fare-guide/fare-guide.component'
import { FrequentlyAskedQuestionsComponent } from './frequently-asked-questions/frequently-asked-questions.component'
import { IntroductionInquiryComponent } from './intorduction-inquiry/introduction-inquiry.component'
import { TermsPrivacyPageComponent } from './terms-privacy-page/terms-privacy-page.component'
import { TermsEulaPageComponent } from './terms-eula-page/terms-eula-page.component'

const routes: Routes = [
    {
        path: '',
        component: HomepageComponent,
        children: [
            { path: '', component: MainComponent },
            { path: 'fare-guide', component: FareGuideComponent },
            { path: 'introduction-inquiry', component: IntroductionInquiryComponent },
            { path: 'FAQ', component: FrequentlyAskedQuestionsComponent },
            { path: 'terms-privacy', component: TermsPrivacyPageComponent },
            { path: 'terms-eula', component: TermsEulaPageComponent },
        ],
    },
    { path: 'homepage', redirectTo: '', pathMatch: 'full' },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomepageRoutingModule {}
