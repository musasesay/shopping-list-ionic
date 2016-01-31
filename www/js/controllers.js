angular.module('shopping-list.controllers', [])

    .controller('ListsCtrl', function ($scope, $ionicListDelegate, Lists) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});
        $scope.lists = Lists.getAllLists();
        $scope.showNewListInputFlag = false;

        $scope.deleteList = function (list) {
            Lists.deleteList(list);
        };
        $scope.clearItemsInList = function (list) {
            Lists.clearItemsInList(list);
            $ionicListDelegate.closeOptionButtons();
        };
        $scope.addList = function (name) {
            Lists.addList(name);
            $scope.showNewListInputFlag = false;
        };
        $scope.showNewListInputField = function () {
            $scope.showNewListInputFlag = true;
        };
    })

    .controller('ItemsCtrl', function ($scope, $stateParams, Lists) {
        $scope.list = Lists.getList($stateParams.listId);
        $scope.showNewItemInputFlag = false;

        $scope.deleteItem = function (itemId) {
            Lists.removeItemById(itemId);
        };
        $scope.addItem = function (list, name) {
            Lists.addItemToList(list, name);
            $scope.showNewItemInputFlag = false;
        };
        $scope.showNewItemInputField = function () {
            $scope.showNewItemInputFlag = true;
        };
        $scope.togglePurchased = function (itemId) {
            Lists.togglePurchased(itemId);
        };
    })

    .controller('AccountCtrl', function ($scope) {
        $scope.settings = {
            enableFriends: true
        };
    })

    .controller('TabCtrl', function ($scope, $location, $ionicTabsDelegate, Lists) {
        $scope.sendVoice = function () {
            try {

                ApiAIPlugin.setListeningStartCallback(function () {
                    //parentElement.setAttribute('style', 'display:block;');
                });

                ApiAIPlugin.setListeningFinishCallback(function () {
                    //parentElement.setAttribute('style', 'display:none;');
                });

                ApiAIPlugin.setRecognitionResultsCallback(function (results) {
                    console.log(results);
                });

                ApiAIPlugin.levelMeterCallback(function (level) {
                    var transform = "scale3d(" + (level + 1.0) + ", " + (level + 1.0) + ", " + (level + 1.0) + ")";

                    /*
                     circle1.style.transform = transform;
                     circle1.style.webkitTransform = transform;

                     circle2.style.transform = transform;
                     circle2.style.webkitTransform = transform;

                     circle3.style.transform = transform;
                     circle3.style.webkitTransform = transform;
                     */
                });

                ApiAIPlugin.requestVoice(
                    {}, // empty for simple requests, some optional parameters can be here
                    function (response) {
                        // place your result processing here
                        //alert(JSON.stringify(response));

                        if (response.status.code === 200) {
                            var voiceAction = response.result.action;
                            var voiceParams = response.result.parameters;
                            //alert("voiceAction:" + voiceAction + ", voiceParams: " + JSON.stringify(voiceParams));
                            var list, path, listId, itemName;
                            if (voiceAction === "useList") {
                                //alert("switching to list: " + voiceParams.list);
                                list = Lists.getListByName(voiceParams.list);
                                //alert("found list: " + JSON.stringify(list));
                                if (list != null) {
                                    $location.path('/tab/lists');
                                    $scope.$apply();
                                    $location.path('/tab/lists/' + list.id);
                                    $scope.$apply();
                                }
                            }
                            else if (voiceAction === "addItemToList") {
                                path = $location.path();
                                //alert("path=" + path);
                                if (path.indexOf('/tab/lists/') == -1) {
                                    alert('Please select a list first.');
                                } else {
                                    listId = path.substr(path.lastIndexOf('/') + 1);
                                    list = Lists.getList(listId);
                                    itemName = voiceParams.item;
                                    //alert("found list: " + JSON.stringify(list) + ", adding item: " + itemName);
                                    if (list != null) {
                                        Lists.addItemToList(list, itemName);
                                        $scope.$apply();
                                    }
                                }
                            }
                            else if (voiceAction === "removeItemFromList") {
                                path = $location.path();
                                //alert("path=" + path);
                                if (path.indexOf('/tab/lists/') == -1) {
                                    alert('Please select a list first.');
                                } else {
                                    listId = path.substr(path.lastIndexOf('/') + 1);
                                    list = Lists.getList(listId);
                                    itemName = voiceParams.item;
                                    //alert("found list: " + JSON.stringify(list) + ", removing item: " + itemName);
                                    if (list != null) {
                                        Lists.removeItemByNameFromList(list, itemName);
                                        $scope.$apply();
                                    }
                                }
                            }
                        }

                    },
                    function (error) {
                        // place your error processing here
                        alert(error);
                    });
            } catch (e) {
                alert(e);
            }
        };

        $scope.stopListening = function () {
            ApiAIPlugin.stopListening();
        };

        $scope.doOnSelect = function () {
            console.info("called doOnSelect");
        };
        $scope.doOnDeselect = function () {
            console.info("called doOnDeselect");
        }
    });
