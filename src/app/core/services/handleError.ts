import { throwError } from 'rxjs'

export default (error: any) => {
    if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message)
    } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.log('error:', error)
        console.error(`Backend returned code ${error.error.code}, ` + `Message: ${error.error.message}`)
    }
    // return an observable with a user-facing error message
    return throwError(() => error.error)
}
