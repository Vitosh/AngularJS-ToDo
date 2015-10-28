var app = angular.module('ToDoPlanner', [])
    .config(function($routeProvider) {
        $routeProvider.
        when('/', {
            controller: ListController,
            templateUrl: 'list.html'
        }).
        when('/edit/:linkId', {
            controller: EditController,
            templateUrl: 'detail.html'
        }).
        when('/new', {
            controller: CreateController,
            templateUrl: 'detail.html'
        }).
        when('/info/:linkId', {
            controller: InfoController,
            templateUrl: 'info.html'
        }).
        when('/delete/:linkId', {
            controller: DeleteController,
            templateUrl: 'delete.html'
        }).
        otherwise({
            controller: Error404Controller,
            templateUrl: 'error404.html'
        });
    });




function ListController($scope, $rootScope, $filter, linkService) {
    $scope.filteredItems = linkService.getLinks();
    $scope.pageSize = 5;
    $scope.pagedItems = [];
    $scope.numberOfPages = function() {
        return Math.ceil($scope.filteredItems.length / $scope.pageSize);
    }

    $scope.search = function() {
        if (!$scope.query || $scope.query === "") {
            $scope.filteredItems = linkService.getLinks();
        } else {
            $scope.filteredItems = $filter('customFilter')(linkService.getLinks(), $scope.query, ["nameproject", "projectaddress", "todo", "responsible"]);
            $rootScope.query = $scope.query;
        }
        $scope.groupToPages();

        if (!$scope.currentPage) {
            $scope.currentPage = 0;
        }
        $scope.currentPage = Math.min($scope.currentPage, $scope.pagedItems.length - 1);
        $rootScope.currentPage = $scope.currentPage;
    };

    $scope.groupToPages = function() {
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.pageSize == 0) {
                $scope.pagedItems[Math.floor(i / $scope.pageSize)] = [$scope.filteredItems[i]];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.pageSize)].push($scope.filteredItems[i]);
            }
        }
    };

    $scope.search();

    $scope.setPage = function(newpage) {
        $scope.currentPage = newpage;
        $rootScope.currentPage = newpage;
    }
}

function CreateController($scope, $location, linkService) {
    $scope.save = function() {
        linkService.addLink(angular.copy($scope.alink));
        $location.path('/');
    }
}

function Error404Controller($scope, $location, $routeParams, linkService) {
    $scope.alink = angular.copy(linkService.findById($routeParams.linkId));
    $scope.original = angular.copy($scope.alink);

    $scope.close = function() {
        $scope.alink = null;
        $scope.project = null;
        $location.path('/');
    }
}

function InfoController($scope, $location, $routeParams, linkService) {
    $scope.alink = angular.copy(linkService.findById($routeParams.linkId));
    $scope.original = angular.copy($scope.alink);

    $scope.close = function() {
        $scope.alink = null;
        $scope.project = null;
        $location.path('/');
    }
}

function UpdateLabels($scope, $location, $routeParams, linkService) {
    $scope.alink = angular.copy(linkService.findById($routeParams.linkId));
    $scope.original = angular.copy($scope.alink);

}

function DeleteController($scope, $location, $routeParams, linkService) {
    $scope.alink = angular.copy(linkService.findById($routeParams.linkId));
    $scope.original = angular.copy($scope.alink);

    $scope.delete = function() {
        linkService.deleteLink($scope.alink);
        $scope.close();
    };

    $scope.close = function() {
        $scope.alink = null;
        $scope.project = null;
        $location.path('/');
    }
}

function EditController($scope, $location, $routeParams, linkService) {

    $scope.alink = angular.copy(linkService.findById($routeParams.linkId));
    $scope.original = angular.copy($scope.alink);

    $scope.isClean = function() {
        return angular.equals($scope.original, $scope.alink);
    };

    $scope.destroy = function() {
        linkService.deleteLink($scope.alink);
        $scope.close();
    };

    $scope.save = function() {
        linkService.updateLink($scope.alink);
        $scope.close();
    };

    $scope.close = function() {
        $scope.alink = null;
        $scope.project = null;
        $location.path('/');
    }
}

app.factory('linkService', function() {
    var data = [{
        Id: 1,
        nameproject: 'VitoshAcademy - fix the outlook!',
        projectaddress: 'http://www.vitoshacademy.com',
        todo: 'Fix the old picture from the main page.',
        info: 'The idea is to fix the outlook',
        responsible: 'The new intern, that I would hire one day.'
    }, {
        Id: 2,
        nameproject: 'VitoshAcademy - write more VBA articles',
        projectaddress: 'http://www.vitoshacademy.com/vba',
        todo: 'Write some more articles for VBA',
        info: 'Write more articles - this is extremely important for the SEO! :)',
        responsible: 'Vitosh'
    }, {
        Id: 3,
        nameproject: 'HateGame - Monetarize it!',
        projectaddress: 'http://hategame.com',
        todo: 'Tell Yavor to make more games.',
        info: 'Finally this site should start making money, Yavore!',
        responsible: 'Vitosh'
    }, {
        Id: 4,
        nameproject: 'VitoshAcademy - fix the outlook - a little better!',
        projectaddress: 'http://www.vitoshacademy.com',
        todo: 'Fix the old picture from the main page.',
        info: 'The idea is to fix the outlook',
        responsible: 'The new intern, that I would hire one day.'
    }, {
        Id: 5,
        nameproject: 'VitoshAcademy - write more VBA articles',
        projectaddress: 'http://www.vitoshacademy.com/vba',
        todo: 'Write some more articles for VBA',
        info: 'Write more articles - this is extremely important for the SEO! :)',
        responsible: 'Vitosh'
    }, {
        Id: 6,
        nameproject: 'HateGame - Monetarize it!',
        projectaddress: 'http://hategame.com',
        todo: 'Tell Yavor to make more games.',
        info: 'Finally this site should start making money, Yavore!',
        responsible: 'Vitosh'
    }, {
        Id: 7,
        nameproject: 'HereComesTheCode - Promote',
        projectaddress: 'http://www.herecomesthecode.com',
        todo: 'Promote the new name of the site',
        info: 'It is a nice domain, or so I have thought when I bought it :)',
        responsible: 'Vitosh'
    }];

    return {
        findById: function(id) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].Id == id) {
                    return data[i];
                }
            }
            return null;
        },

        getLinks: function() {
            return data;
        },
        addLink: function(item) {
            item.Id = new Date().getTime();
            data.push(item);
        },
        deleteLink: function(item) {
            var tempItem = this.findById(item.Id);
            data.splice(data.indexOf(tempItem), 1);
        },
        updateLink: function(item) {
            var p = this.findById(item.Id);
            if (!p)
                this.addLink(item);
            copy(item, p);
        }
    };
});

function copy(o, t) {
    if (!t)
        t = {};
    Object.keys(o).forEach(function(val) {
        t[val] = o[val];
    });
    return t;
}

function searchMatch(place_to_search, thing_to_search) {
    if (typeof(place_to_search) != "string")
        return false;
    if (!thing_to_search) {
        return true;
    }
    return place_to_search.toLowerCase().indexOf(thing_to_search.toLowerCase()) !== -1;
};


app.filter('startFrom', function() {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    }
});

app.filter('customFilterTags', function() {
    return function(links, queryStr) {
        var arr = [];
        for (var i = links.length; i--;) {
            if (links[i].tag.toLowerCase().indexOf(queryStr.toLowerCase()) !== -1) {
                arr.push(links[i]);
            }
        }
        return arr;
    }
});

app.filter('customFilter', function() {
    return function(data, queryStr, includedAttributes) {
        var resultArray = [];
        for (var i = data.length; i--;) {
            var item = data[i];
            var found = false;
            for (var attr in item) {
                if (includedAttributes.indexOf(attr) > -1) {
                    if (searchMatch(item[attr], queryStr)) {
                        found = true;
                        break;
                    }
                }
            }
            if (found) {
                resultArray.push(item);
            }
        }
        return resultArray;
    }
});


app.controller('myCtrl', ['$scope', function($scope) {
    $scope.counter = 6;

    $scope.update_label = function(my_value) {
        console.log(my_value);

        var lbl = document.getElementById("label_with_data");
        var lbl_2 = document.getElementById("label_with_data_2");

        $scope.counter++;

        lbl_2.innerHTML = my_value;

        switch ($scope.counter % 7) {
            case 0:
                lbl.innerHTML = "You're my heart!";
                break;
            case 1:
                lbl.innerHTML = "You're my soul!";
                break;
            case 2:
                lbl.innerHTML = "La lalalala!~";
                break;
            case 3:
                lbl.innerHTML = "Thank you for clicking ...";
                break;
            case 4:
                lbl.innerHTML = "And for your interest ...";
                break;
            case 5:
                lbl.innerHTML = "Now from the beginning ...";
                break;
            case 6:
                lbl.innerHTML = "Ready - Steady - Go";
                break;
        }
    };
}]);