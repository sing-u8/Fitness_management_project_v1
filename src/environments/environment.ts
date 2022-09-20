export const environment = {
    production: false,
    protocol: 'https://',
    subDomain: 'devapi.',
    domain: 'redwhale.xyz',
    port: '',
    version: '/latest',
    wss: 'wss://m7gslx5e5k.execute-api.ap-northeast-2.amazonaws.com/dev',
    firebase: {
        projectId: 'redwhale-f9890',
        appId: '1:830659387924:web:6ad49776c58835ac10bd01',
        storageBucket: 'redwhale-f9890.appspot.com',
        apiKey: 'AIzaSyDM4worb5VgtYUTH9O6iBJBrKp2v42Orps',
        authDomain: 'redwhale-f9890.firebaseapp.com',
        messagingSenderId: '830659387924',
        measurementId: 'G-968N2LKCEZ',
    },
    kakao: {
        appKey: {
            javascript: '80f7f2934ed2250481af1936d4de9da5',
            restApi: '42b0d7c314dfd0ca21abe57fee6dc392',
        },
        redirectUri: 'https://dev.redwhale.xyz/auth/callback/sign-in-with-kakao',
    },
    RECAPTCHA_SITE_KEY: '6Lft2NMZAAAAABaEafU1cNe_aXgjCkZgYYDFEIet',
}

/*
dev.
:3000

devapi
''

export const environment = {
    production: true,
    protocol: 'https://',
    subDomain: 'api.',
    domain: 'redwhale.xyz',
    port: ':443',
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
