angular.module('GigRef.services', [])

    .factory('JobService', function($http, $q, $log) {
        return {
            findAll: function (pageNumber) {
                var deferred = $q.defer(); //promise
                $http({ method: 'GET', url: 'http://shawn-vmoksha.spritle.com/filter_jobs?languages=&locations=&page=' + pageNumber }).
            success(function (data, status, headers, config) {
                deferred.resolve(data);
                //$log.info(data, status, headers, config);
            }).
            error(function (data, status, headers, config) {
                deferred.reject(status);
                //$log.warn(data, status, headers, config);
            });
                return deferred.promise;
            }, //End of findAll

            findById: function (jobId) {
                var deferred = $q.defer(); //promise
                $http({ method: 'GET', url: 'http://shawn-vmoksha.spritle.com/job_details/' + jobId }).
            success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).
            error(function (data, status, headers, config) {
                deferred.reject(status);
            });
                return deferred.promise;
            }, //End of findById

            getLanguageLocation:function(){
                var deferred = $q.defer();//promise object
                $http({ method: 'GET', url: 'http://shawn-vmoksha.spritle.com/get_language_location' }).
                    success(function (data, status, headers, config) {
                        console.log(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject(status);
                    });
                return deferred.promise;
            }, //End of getLanguageLocation

            filterJobs: function (url) {
                var deferred = $q.defer(); //promise object
                $http({ method: 'GET', url: 'http://shawn-vmoksha.spritle.com/filter_jobs?' + url }).
                    success(function (data, status, headers, config) {
                        console.log(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject(status);
                    });
                return deferred.promise;
            }
        }
    })

    .factory('JobDetailService', function($http, $q, $log){
            return{
                referFriend: function (formData, jobId){
                    var params = '{"job_referral" : {"referred_name" : "'+ formData.FName +'", "referred_email" : "'+ formData.FEmail+'", "referee_name" : "'+ formData.YName +'", "referee_email" : "'+ formData.YEmail +'", "job_id" : '+ jobId +'}, "token" : "Vm1Sp2Jl0PRdEr943SpnxxJhK9"}';
                    var deferred = $q.defer(); //promise
                    $http({
                        method: 'POST',
                        url: 'http://shawn-vmoksha.spritle.com/api/refer_friend' ,
                        data: params,
                        headers : { 'Content-Type': 'application/json','Accept':'application/json' }
                    }).
                        success(function (data, status, headers, config) {
                            deferred.resolve(data);
                            //$log.info(data, status, headers, config);
                        }).
                        error(function (data, status, headers, config) {
                            deferred.reject(status);
                            //$log.warn(data, status, headers, config);
                        });
                    return deferred.promise;
                },
                sendMeNewJobs:function(formData){
                    var params = '{"news_letter" : {"subscriber_name" : "'+ formData.YName +'" , "subscriber_email" : "'+ formData.YEmail +'"}, "token" : "Vm1Sp2Jl0PRdEr943SpnxxJhK9"}';
                    var deferred = $q.defer(); //promise
                    $http({
                        method: 'POST',
                        url: 'http://shawn-vmoksha.spritle.com/api/send_new_jobs' ,
                        data: params,
                        headers : { 'Content-Type': 'application/json','Accept':'application/json' }
                    }).
                        success(function (data, status, headers, config) {
                            deferred.resolve(data);
                            //$log.info(data, status, headers, config);
                        }).
                        error(function (data, status, headers, config) {
                            deferred.reject(status);
                            //$log.warn(data, status, headers, config);
                        });
                    return deferred.promise;
                }
            }
    });