import { NgModule } from '@angular/core'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { HttpInterceptorService } from '@services/http-interceptor.service'

@NgModule({
    declarations: [],
    imports: [HttpClientModule],
    exports: [],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptorService,
            multi: true,
        },
    ],
})
export class CoreModule {}
