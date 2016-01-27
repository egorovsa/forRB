
var configData = {
    'GENERAL_CONFIG': {
        'APP_NAME': 'filter'
        , 'APP_VERSION': '0.0.1'
    }
};

var racefilter = angular.module('racefilter', []);


angular.forEach(configData, function (key, value) {
    racefilter.constant(value, key);
});

racefilter.directive('racefilter', function ($rootScope, filterButtons, GENERAL_CONFIG) {
    return {
        scope: {},
        require: 'ngModel',
        templateUrl: '../../../templates/filter.html',
        link: function (scope, el, attrs, ngModel) {
            scope.filterButtons = filterButtons;
            ngModel.$setViewValue(scope.filterButtons);
            scope.set = function () {
                this.fb.active = !this.fb.active;
                ngModel.$setViewValue(scope.filterButtons);
            };
        }
    };
});


racefilter.factory('filterButtons', function () {
    var get = [
        {
            type: 'G'//Gallop,
            , className: 'first'
            , active: true
        }
        , {
            type: 'J'//Jumping
            , className: 'second'
            , active: true
        }
        , {
            type: 'T'//Trot.
            , className: 'third'
            , active: true
        }
        , {
            type: 'D'//DOGS.
            , className: 'fourth'
            , active: false
        }
    ];
    return get;
});


