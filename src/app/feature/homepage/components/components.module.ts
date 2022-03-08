import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'
import { HomepageHeaderComponent } from './homepage-header/homepage-header.component'
import { ButtonComponent } from './button/button.component'

@NgModule({
    declarations: [HomepageHeaderComponent, ButtonComponent],
    imports: [CommonModule, FormsModule, SharedModule],
    exports: [HomepageHeaderComponent, ButtonComponent],
})
export class ComponentsModule {}
