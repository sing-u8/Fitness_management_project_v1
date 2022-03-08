import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { HomepageComponent } from './homepage.component'
import { MainComponent } from './main/main.component'
import { FareGuideComponent } from './fare-guide/fare-guide.component'
import { FrequentlyAskedQuestionsComponent } from './frequently-asked-questions/frequently-asked-questions.component'
import { IntorductionInquiryComponent } from './intorduction-inquiry/intorduction-inquiry.component'

const routes: Routes = [
    {
        path: '',
        component: HomepageComponent,
        children: [
            { path: '', component: MainComponent },
            { path: 'fare-guide', component: FareGuideComponent },
            { path: 'introduction-inquiry', component: IntorductionInquiryComponent },
            { path: 'FAQ', component: FrequentlyAskedQuestionsComponent },
        ],
    },
    { path: 'homepage', redirectTo: '', pathMatch: 'full' },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomepageRoutingModule {}
