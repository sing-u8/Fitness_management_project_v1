import { NgModule } from '@angular/core'

import { ComponentsRoutingModule } from './components-routing.module'
import { SharedModule } from '@shared/shared.module'

import { ComponentsComponent } from './components.component'

@NgModule({
    declarations: [ComponentsComponent],
    imports: [ComponentsRoutingModule, SharedModule],
    exports: [ComponentsComponent],
    providers: [],
})
export class ComponentsModule {}
