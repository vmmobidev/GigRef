angular.module('GigRef', ['ionic', 'GigRef.services', 'GigRef.controllers', 'ngSanitize'])

    .run(function ($rootScope, $state, $ionicPlatform, $window) {
        console.log("run>>");
        $ionicPlatform.ready(function () {
            console.log("ready>>");
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        console.log("config>>");
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/slidemenu.html",
                controller: "AppCtrl"
            })

            .state('app.job-index', {
                url: '/jobs',
                views: {
                    'menuContent': {
                        templateUrl: "templates/job-index.html",
                        controller: "JobListController"
                    }
                }
            })

             .state('app.job-detail', {
                 url: '/job/:jobId',
                 views: {
                     'menuContent': {
                         templateUrl: "templates/job-detail.html",
                         controller: "JobDetailsController"
                     }
                 }
             })

            .state('app.howitworks', {
                url: '/howitworks',
                views: {
                    'menuContent': {
                        templateUrl: "templates/howitworks.html",
                        controller: "HowItWorksController"
                    }
                }
            })
        // if none of the above states are matched, use this as the fallback
             $urlRouterProvider.otherwise('/app/jobs');

    });
