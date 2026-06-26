// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // firebase: {
  //   apiKey: 'AIzaSyA5p3rU3z-A0QwV5_fEryVvQh4CFvlJckg',
  //   authDomain: 'pockit-df54e.firebaseapp.com',
  //   projectId: 'pockit-df54e',
  //   storageBucket: 'pockit-df54e.firebasestorage.app',
  //   messagingSenderId: '658839127239',
  //   appId: '1:658839127239:web:9d5101fb9718275b116ae2',
  //   measurementId: 'G-N76JL181BX',
  //   appVersion1: require('../../package.json').version + '-dev',
  //   appVersion2: require('../../package.json').version,
  // },

  firebase: {
    apiKey: "AIzaSyBj6S9NDTwliQXF74jZ-a6FReHhTNLa6dk",
    authDomain: "arvaya-d841e.firebaseapp.com",
    projectId: "arvaya-d841e",
    storageBucket: "arvaya-d841e.firebasestorage.app",
    messagingSenderId: "577574167930",
    appId: "1:577574167930:web:2c70d1e2a988922976a2c3",
    measurementId: "G-HQ0NNY7WY6",
    appVersion1: require('../../package.json').version + '-dev',
    appVersion2: require('../../package.json').version,
    vapidKey: "BOX1X7HQxIsJHIVWVypB2uOUzH2kzmxeNiwW2vsO-FMv9zinvISuGiJtZZcuQJdOem4ond9G0VGg8G0ezc8KmRM" // <-- Use this
  },

  // Gemini AI API Key for PDF data extraction
  geminiApiKey: "AIzaSyBj6S9NDTwliQXF74jZ-a6FReHhTNLa6dk" // Using Firebase API key (can be replaced with dedicated Gemini key)


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
