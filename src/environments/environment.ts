// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    protocol: 'https://',
    subDomain: 'api.',
    domain: 'redwhale.xyz',
    port: '',
    version: '/latest',
    wss: 'wss://nwa565188k.execute-api.ap-northeast-2.amazonaws.com/dev',
    firebase: {
        apiKey: 'AIzaSyBfX29oNTYgHYCOobsrCXpRXKhTxvdpenI',
        authDomain: 'redwhale-f9a21.firebaseapp.com',
        databaseURL: 'https://redwhale-f9a21.firebaseio.com',
        projectId: 'redwhale-f9a21',
        storageBucket: 'redwhale-f9a21.appspot.com',
        messagingSenderId: '31023318401',
        appId: '1:31023318401:web:4a81ab87ee92b45af3d480',
        measurementId: 'G-8MFGNK2B6L',
    },
    kakao: {
        appKey: {
            javascript: '238fca776f9dde773b05c213f22e642b',
        },
    },
    RECAPTCHA_SITE_KEY: '6Lft2NMZAAAAABaEafU1cNe_aXgjCkZgYYDFEIet',
}

/*

export const environment = {
    production: false,
    protocol: 'https://',
    subDomain: 'dev.',
    domain: 'redwhale.xyz',
    port: ':3000',
    version: '/latest',
    wss: 'wss://nwa565188k.execute-api.ap-northeast-2.amazonaws.com/dev',
    firebase: {
        apiKey: 'AIzaSyBfX29oNTYgHYCOobsrCXpRXKhTxvdpenI',
        authDomain: 'redwhale-f9a21.firebaseapp.com',
        databaseURL: 'https://redwhale-f9a21.firebaseio.com',
        projectId: 'redwhale-f9a21',
        storageBucket: 'redwhale-f9a21.appspot.com',
        messagingSenderId: '31023318401',
        appId: '1:31023318401:web:4a81ab87ee92b45af3d480',
        measurementId: 'G-8MFGNK2B6L',
    },
    kakao: {
        appKey: {
            javascript: '238fca776f9dde773b05c213f22e642b',
        },
    },
    RECAPTCHA_SITE_KEY: '6Lft2NMZAAAAABaEafU1cNe_aXgjCkZgYYDFEIet',
}


*/

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
