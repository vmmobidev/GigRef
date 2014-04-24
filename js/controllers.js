angular.module('GigRef.controllers', [])


.controller('AppCtrl', function ($scope, $ionicModal,JobDetailService,$ionicPopup,$ionicLoading) {
        $scope.smnjFormData = {}; /*create an object to hold the form data from refer modal*/
        $scope.submitSMNJ = function(){
            $scope.showSNMJLoader();
            JobDetailService.sendMeNewJobs($scope.smnjFormData).then(function(res){
                $scope.hideSNMJLoader();
                $scope.modalSMNJ.hide();
                $ionicPopup.alert({
                    title:'Success',
                    content:res.message
                });
            });
        }
    /*Show contacts modal ---- start*/
    $scope.showContactsModal = function () {
        $scope.modalContacts.show();
    }
    $ionicModal.fromTemplateUrl('templates/modal-contacts.html', function (modal) {
        $scope.modalContacts = modal;
    }, {
        animation: 'slide-in-up'
    });
    /*Show contacts modal ---- end*/
    /*Show terms n conditions modal ---- start*/
    $scope.showTNCModal = function () {
        $scope.modalTNC.show();
    }
    $ionicModal.fromTemplateUrl('templates/modal-termsnconditions.html', function (modal) {
        $scope.modalTNC = modal;
    }, {
        animation: 'slide-in-up'
    });
    /*Show terms n conditions modal ---- end*/

    /*Show privacy modal ---- start*/
    $scope.showPrivacyModal = function () {
        $scope.modalPrivacy.show();
    }
    $ionicModal.fromTemplateUrl('templates/modal-privacy.html', function (modal) {
        $scope.modalPrivacy = modal;
    }, {
        animation: 'slide-in-up'
    });
    /*Show privacy modal ---- end*/

    /*Show send me new jobs modal ---- start*/
    $scope.showSMNJModal = function () {
        $scope.modalSMNJ.show();
    }
    $ionicModal.fromTemplateUrl('templates/modal-sendmejobs.html', function (modal) {
        $scope.modalSMNJ = modal;
    }, {
        scope:$scope,
        animation: 'slide-in-up'
    });
    /*Show send me new jobs modal ---- end*/


        $scope.showSNMJLoader = function () {
            $scope.smnjSending = $ionicLoading.show({
                content: 'Sending...'
            });
        };
        $scope.hideSNMJLoader = function () {
            $scope.smnjSending.hide();
        };
})

.controller('JobListController', function ($scope, $ionicSideMenuDelegate, $ionicModal, $ionicLoading, JobService) {
    //var loc = null;
    var findAllJobs = function () {
        console.log("Retrieving Jobs");
        $scope.show();
        localStorage.clear();
        JobService.findAll().then(function (res) {
            var backcolor = { "Novice": "gray", "Intermediate": "blue", "Advanced": "green" }
            var fontcolor = { "Novice": "69952d", "Intermediate": "a3830b", "Advanced": "9e3f3c" }
            angular.forEach(res.jobs, function (value, key) {
                res.jobs[key].backcolor = backcolor[value.category]
                res.jobs[key].fontcolor = fontcolor[value.category]
                //console.log("Key = ["  + key +  "] , category = [" + value.category + "]")
            });
            $scope.hide();
            $scope.items = res.jobs.length;
            // Used with pull-to-refresh
            $scope.$broadcast('scroll.refreshComplete');
            $scope.jobs = res.jobs
        });

        JobService.getLanguageLocation().then(function (res) {
            console.log("res.locations = " + res.locations.length)
            console.log("res.languages = " + res.languages.length)
            $scope.locations = res.locations;
            $scope.languages = res.languages;
            //loc = res.locations;
            //$scope.hide();
        });
    }


    $scope.toggleLeft = function () {
        console.log("toggleLeft");
        $ionicSideMenuDelegate.toggleLeft();
    };

    //pull to refresh
    $scope.show = function () {
        $scope.loading = $ionicLoading.show({
            content: 'Loading jobs...'
        });
    };
    $scope.hide = function () {
        $scope.loading.hide();
    };


    $scope.ShowModalFilter = function () {
        $scope.modalFilter.show();
        //$scope.locations = loc;
    }

    $scope.changedLangChk = function (obj) {
        $scope.checkedLangs = ($scope.checkedLangs == undefined || $scope.checkedLangs == 0) ? [] : $scope.checkedLangs;
        if (this.isChecked) {

            $scope.checkedLangs.push(obj.name);
        } else {
            angular.forEach($scope.checkedLangs, function (item, index) {
                if (item == obj.name) {
                    $scope.checkedLangs.splice(index, 1);

                }
            });
        }
        localStorage.setItem('Languages', $scope.checkedLangs);
    }
    $scope.changedLocChk = function (obj) {
        $scope.checkedLocs = ($scope.checkedLocs == undefined || $scope.checkedLocs == 0) ? [] : $scope.checkedLocs;
        if (this.isChecked) {

            $scope.checkedLocs.push(obj.id);
        } else {
            angular.forEach($scope.checkedLocs, function (item, index) {
                if (item == obj.id) {

                    $scope.checkedLocs.splice(index, 1);

                }
            });
        }
        localStorage.setItem('Locations', $scope.checkedLocs);
    }

    $ionicModal.fromTemplateUrl('templates/modal-filter.html', function (modal) {
        $scope.modalFilter = modal;
    }, {
        scope: $scope,  /// GIVE THE MODAL ACCESS TO PARENT SCOPE
        animation: 'slide-in-up'
    });

    $scope.filterJobs = function () {
        $scope.modalFilter.hide();
        $scope.show();
        var searchParams = "languages=";
        $scope.checkedLangs == undefined ? $scope.checkedLangs = [] : $scope.checkedLangs;
        if ($scope.checkedLangs.length == 0) searchParams += '&';
        else {
            angular.forEach($scope.checkedLangs, function (thisItem, i) {
                searchParams += thisItem;
                searchParams += (i + 1 == $scope.checkedLangs.length) ? '&' : ','
            });
        }
        searchParams += "locations=";
        $scope.checkedLocs == undefined ? $scope.checkedLocs = [] : $scope.checkedLocs;
        if ($scope.checkedLocs.length == 0) searchParams += '&';
        else {
            angular.forEach($scope.checkedLocs, function (thisItem, i) {
                searchParams += thisItem;
                searchParams += (i + 1 == $scope.checkedLocs.length) ? '&' : ','
            });
        }

        searchParams += 'page=1';
        if ($scope.checkedLangs.length == 0 && $scope.checkedLocs.length == 0) {
            localStorage.clear();
        }
        JobService.filterJobs(searchParams).then(function (res) {
            var backcolor = { "Novice": "gray", "Intermediate": "blue", "Advanced": "green" }
            var fontcolor = { "Novice": "69952d", "Intermediate": "a3830b", "Advanced": "9e3f3c" }
            angular.forEach(res.jobs, function (value, key) {
                res.jobs[key].backcolor = backcolor[value.category]
                res.jobs[key].fontcolor = fontcolor[value.category]
                //console.log("Key = ["  + key +  "] , category = [" + value.category + "]")
            });
            $scope.jobs = res.jobs;
            $scope.hide()
        });
    }

    $scope.doRefresh = findAllJobs;
    //pull to refresh end
    if ($scope.$navDirection != null) {
        if ((localStorage.getItem('Languages') != null) || (localStorage.getItem('Locations' != null))) {
            var searchParams = "languages=";
            if (localStorage.getItem('Languages') != null) {
                searchParams += (localStorage.getItem('Languages'));
            }
            searchParams += '&';
            searchParams += "locations=";
            if (localStorage.getItem('Locations') != null) {
                searchParams += (localStorage.getItem('Locations'));
            }
            searchParams += '&';
            searchParams += 'page=1';
            JobService.filterJobs(searchParams).then(function (res) {
                var backcolor = { "Novice": "gray", "Intermediate": "blue", "Advanced": "green" }
                var fontcolor = { "Novice": "69952d", "Intermediate": "a3830b", "Advanced": "9e3f3c" }
                angular.forEach(res.jobs, function (value, key) {
                    res.jobs[key].backcolor = backcolor[value.category]
                    res.jobs[key].fontcolor = fontcolor[value.category]
                });
                $scope.jobs = res.jobs;
            });

            JobService.getLanguageLocation().then(function (res) {
                console.log("res.locations = " + res.locations.length)
                console.log("res.languages = " + res.languages.length)
                $scope.locations = res.locations;
                $scope.languages = res.languages;
            });
        }
        else {
            findAllJobs();
        }
    }
    else {
        findAllJobs();
    }

}) //End of contoller

 .controller('JobDetailsController', function ($scope, $stateParams, $ionicModal, $ionicLoading, JobService,JobDetailService,$ionicPopup) {
     $scope.referFormData = {}; /*create an object to hold the form data from refer modal*/

     var findJobById = function (id) {
         $scope.show();
         JobService.findById(id).then(function (res) {
             var backcolor = { "Novice": "gray", "Intermediate": "blue", "Advanced": "green" }
             var fontcolor = { "Novice": "69952d", "Intermediate": "a3830b", "Advanced": "9e3f3c" }
             res.backcolor = backcolor[res.category]
             res.fontcolor = fontcolor[res.category]
             $scope.job = res;
             $scope.hide();
         });
     }

     $scope.submitRefer = function(){
         $scope.showReferLoader();
        JobDetailService.referFriend($scope.referFormData,$stateParams.jobId).then(function(res){
            $scope.hideReferLoader();
            $scope.modalRefer.hide();
            $ionicPopup.alert({
                title:'Success',
                content:res.message
            });
        });
     }



     $scope.ShowModalRefer = function () {
         $scope.modalRefer.show();
     }

     $scope.ShowModalApply = function () {
         $scope.modalApply.show();
     }

     $ionicModal.fromTemplateUrl('templates/modal-refer.html', function (modal) {
         $scope.modalRefer = modal;
     }, {
         scope: $scope,
         animation: 'slide-in-up'
     });

     $ionicModal.fromTemplateUrl('templates/modal-apply.html', function (modal) {
         $scope.modalApply = modal;
     }, {
         scope:$scope,
         animation: 'slide-in-up'
     });


     //pull to refresh
     $scope.show = function () {
         $scope.loading = $ionicLoading.show({
             content: 'Loading job details...'
         });
     };
     $scope.hide = function () {
         $scope.loading.hide();
     };

    $scope.showReferLoader = function () {
        $scope.referSending = $ionicLoading.show({
            content: 'Sending...'
        });
    };
    $scope.hideReferLoader = function () {
        $scope.referSending.hide();
    };
     findJobById($stateParams.jobId);


 })

.controller('HowItWorksController', function ($scope, $ionicModal, $http) {
    $http.get('js/faq.js')
       .then(function (res) {
           $scope.faq = res.data;
       });
})