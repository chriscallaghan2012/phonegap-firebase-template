/*global $, firebase*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.fb = oApp.fb || {};

    oApp.fb.storeBase64 = function (location, base64) {

        var storage = firebase.storage(),
            storageRef = storage.ref(),
            imagesRef = storageRef.child(location);

        imagesRef.putString(base64, 'base64url').then(function (snapshot) {
            console.log('Uploaded a base64url string!');
            console.log(snapshot);
        });
    };

}());