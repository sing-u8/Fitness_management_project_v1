import { NgModule } from '@angular/core'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'

import { HttpInterceptorService } from '@services/interceptor/http-interceptor.service'

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
