// var ui = new firebaseui.auth.AuthUI(firebase.auth());
// var uiConfig = {
//     callbacks: {
//       signInSuccess: function(currentUser, credential, redirectUrl) {
//         // User successfully signed in.
//         // Return type determines whether we continue the redirect automatically
//         // or whether we leave that to developer to handle.
//         return true;
//       },
//       uiShown: function() {
//         // The widget is rendered.
//         // Hide the loader.
//         document.getElementById('loader').style.display = 'block';
//       }
//     },
//     // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
//     signInFlow: 'popup',
//     signInSuccessUrl: '<url-to-redirect-to-on-success>',
//     signInOptions: [
//       // Leave the lines as is for the providers you want to offer your users.
//     //   firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     //   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//     //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//     //   firebase.auth.GithubAuthProvider.PROVIDER_ID,
//     //   firebase.auth.EmailAuthProvider.PROVIDER_ID,
//   {  provider:firebase.auth.PhoneAuthProvider.PROVIDER_ID,
//     recaptchaParameters: {
//       // type: 'image', // 'audio'
//       size: 'normal', // 'invisible' or 'compact'
//       badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
//     },
//     defaultCountry: 'IN', // Set default country to the United Kingdom (+44).
//     // For prefilling the national number, set defaultNationNumber.
//     // This will only be observed if only phone Auth provider is used since
//     // for multiple providers, the NASCAR screen will always render first
//     // with a 'sign in with phone number' button.
//     defaultNationalNumber: '9999288920',
//     // You can also pass the full phone number string instead of the
//     // 'defaultCountry' and 'defaultNationalNumber'. However, in this case,
//     // the first country ID that matches the country code will be used to
//     // populate the country selector. So for countries that share the same
//     // country code, the selected country may not be the expected one.
//     // In that case, pass the 'defaultCountry' instead to ensure the exact
//     // country is selected. The 'defaultCountry' and 'defaultNationaNumber'
//     // will always have higher priority than 'loginHint' which will be ignored
//     // in their favor. In this case, the default country will be 'GB' even
//     // though 'loginHint' specified the country code as '+1'.
//     loginHint: '+11234567890' 
//   }
      
//     ],
//     // Terms of service url.
//     tosUrl: '<your-tos-url>'
//   };

//   // The start method will wait until the DOM is loaded.
// ui.start('#firebaseui-auth-container', uiConfig);


