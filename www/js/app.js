// Ionic Shopping List App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'shopping-list' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'shopping-list.services' is found in services.js
// 'shopping-list.controllers' is found in controllers.js
angular.module('shopping-list', ['ionic', 'shopping-list.controllers', 'shopping-list.services', 'shopping-list.directives'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function ($cordovaKeyboard) {

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                //alert('keyboard enabled');
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(false);
                //cordova.plugins.Keyboard.open();
            }

            //if ($cordovaKeyboard) {
            //    alert('foo');
            //    $cordovaKeyboard.hideKeyboardAccessoryBar(true);
            //    $cordovaKeyboard.disableScroll(false);
            //    $cordovaKeyboard.open();
            //}

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            ApiAIPlugin.init(
                {
                    subscriptionKey: "824ce87d-fbeb-44d4-b27e-59d817be604b",
                    clientAccessToken: "1733440715494ae1a334545dda261235",
                    lang: "en"
                },
                function (result) {
                    console.info("Init success");
                },
                function (error) {
                    alert("Init error\n" + error);
                }
            );

        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
            })

            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html',
                controller: 'TabCtrl'
            })

            .state('tab.lists', {
                url: '/lists',
                views: {
                    'tab-lists': {
                        templateUrl: 'templates/lists.html',
                        controller: 'ListsCtrl'
                    }
                }
            })
            .state('tab.list-items', {
                url: '/lists/:listId',
                views: {
                    'tab-lists': {
                        templateUrl: 'templates/items.html',
                        controller: 'ItemsCtrl'
                    }
                }
            })

            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/account.html',
                        controller: 'AccountCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    })

    .constant('API_HOST', 'http://omars-macbook-pro.local:8080')
    .constant('LOCAL_STORAGE_USER_ID_KEY', 'shopping.list.user.id')
;
