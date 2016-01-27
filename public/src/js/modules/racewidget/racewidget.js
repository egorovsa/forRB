
var configData = {
    'GENERAL_CONFIG': {
        'APP_NAME': 'raceWiget',
        'APP_VERSION': '0.0.1',
        'BUTTON_LINK': 'http://www.racebets.com/bet/',
        // main currency to GBP
        'CURRENCIES': {
            GBP: 1
            , EUR: 0.77

        }
    }
};

var racewidget = angular.module('racewidget', []);

angular.forEach(configData, function (key, value) {
    racewidget.constant(value, key);
});

racewidget.run(function ($rootScope, $http) {
    //Getting json data from backend side
    $http.get('/next_races.json').success(function (json) {
        $rootScope.serverData = json;
        $rootScope.$broadcast('json-ready');
    }).error(function (header, status) {
        console.info(header);
        console.info(status);
    });
});

racewidget.directive('racewidget', function ($rootScope, GENERAL_CONFIG) {
    return {
        scope: {
            filterResults: '='
        },
        templateUrl: '../../../templates/raceWiget.html',
        link: function (scope, el, attrs) {
            scope.buttonLink = GENERAL_CONFIG.BUTTON_LINK;
            scope.currencyes = GENERAL_CONFIG.CURRENCIES;
            //When json is received
            scope.$on('json-ready', function (event, args) {
                scope.races = $rootScope.serverData.data.races;
                scope.btns = scope.filterButtons;
            });
        }
    };
});


/*
 * Filter for racing types filtering
 */
racewidget.filter('types', function () {
    return function (data, filterButtons) {
        var result = [];
        if (data && filterButtons) {
            data.map(function (race) {
                filterButtons.map(function (fb) {
                    if (fb.active && fb.type == race.race_type)
                        result.push(race);
                });
            });
        }
        return result;
    };
});

/*
 * Filter for currency convertations
 */
racewidget.filter('convertCurrencyes', function () {
    return function (data, currencyes) {
        if (data && currencyes) {
            data.map(function (race) {
                var currentCurrency = currencyes[race.purse.currency];
                race.purse.ourAmount = race.purse.amount * currentCurrency;
            });
        }
        return data;
    };
});




