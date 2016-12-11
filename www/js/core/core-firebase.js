/*global $, firebase*/
/*jslint eqeq:true plusplus:true*/

var oApp = oApp || {};

(function () {

	'use strict';

    oApp.fb = oApp.fb || {
        auth: {
            register: {},
            signin: {}
        },
        db: {},
        storage: {}
    };

    oApp.fb.storage.monitor = function (task) {
        task.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            oApp.fb.storage.progress = progress.toFixed(2);
        }, function (error) {
            oApp.fb.storage.progress = error;
        }, function () {
            oApp.fb.storage.progress = task.snapshot.downloadURL;
        });
    };

    oApp.fb.storage.string = function (file, string) {

        var obj = {
            dfd: $.Deferred(),
            success: function (success) {
                obj.dfd.resolve(success);
            },
            error: function (error) {
                obj.dfd.reject(error);
            }
        },
            ref = firebase.storage().ref().child(file),
            task = ref.putString(string);

        task.then(function (success) {
            obj.dfd.resolve(success.downloadURL);
        });
        oApp.fb.storage.monitor(task);

        return obj.dfd.promise();
    };

    oApp.fb.storage.image = function (file, base64) {

        var obj = {
            dfd: $.Deferred(),
            success: function (success) {
                obj.dfd.resolve(success);
            },
            error: function (error) {
                obj.dfd.reject(error);
            }
        },

            ref = firebase.storage().ref().child(file),
            task = ref.putString(base64, 'base64');

        task.then(function (success) {
            obj.dfd.resolve(success.downloadURL);
        });
        oApp.fb.storage.monitor(task);

        return obj.dfd.promise();

    };

    oApp.fb.auth.setUpListener = function () {

        firebase.auth().onAuthStateChanged(function (user) {
            oApp.fb.handleAuthChange(user);
        });

    };

    oApp.fb.auth.register.password = function (email, password) {

        var obj = oApp.deferred.getDefaultObject();

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (success) {
                obj.dfd.resolve(success);
            })
            .catch(function (error) {
                obj.dfd.reject(error);
            });

        return obj.dfd.promise();

    };

    oApp.fb.auth.signin.password = function (email, password) {

        var obj = oApp.deferred.getDefaultObject();

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (success) {
                obj.dfd.resolve(success);
            })
            .catch(function (error) {
                obj.dfd.reject(error);
            });

        return obj.dfd.promise();

    };

    oApp.fb.auth.handleSigninPasswordFail = function (error) {
        oApp.core.alert(error.message, null, error.code);
    }

    oApp.fb.auth.signout = function () {

        var obj = oApp.deferred.getDefaultObject();

        firebase.auth().signOut()
            .then(function (success) {
                obj.dfd.resolve(success);
            })
            .catch(function (error) {
                obj.dfd.reject(error);
            });

        return obj.dfd.promise();

    };

    oApp.fb.auth.user = function () {

        return firebase.auth().currentUser;

    };

    oApp.fb.db.addToList = function (path, data) {

        var dbRef = oApp.fb.dbo.ref(path),
            newPostRef = dbRef.push();

        newPostRef.set(data);

        return newPostRef;

    };

    oApp.fb.db.viewList = function (path, callback) {

        var dbRef = oApp.fb.dbo.ref(path);

        dbRef.on('value', callback);

    };

    oApp.fb.handleAuthChange = function (user) {
        console.groupEnd();

        if (user) {
            console.groupCollapsed('User');
            console.log(oApp.fb.getUserObject(user));
            console.groupEnd('User');
        } else {
            console.log('No user signed in');
        }

    };

    oApp.fb.getUserObject = function (user) {

        return {
            'email': user.email,
            'name': user.displayName,
            'photoUrl': user.photoURL,
            'uid': user.uid
        };

    };

}());
