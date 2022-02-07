import { NgModule } from '@angular/core'

import { SharedModule } from '@shared/shared.module'
import { CommonModule as AngularCommonModule } from '@angular/common'

import { HeaderComponent } from './header/header.component'

@NgModule({
    declarations: [HeaderComponent],
    imports: [SharedModule, AngularCommonModule],
    exports: [HeaderComponent],
    providers: [],
})
export class CommonModule {}
