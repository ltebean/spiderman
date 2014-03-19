app.directive("component", ["$timeout",function($timeout){
    return {
        restrict: 'E',
        scope: {
            title:"@ngTitle",
            type:"@ngType",
            segues:"=ngSegues",
            onEditConnection:"&ngEditConnection"
        },
        replace:true,
        template: "<div class='component w'><span class='title'>{{title}}</span><span class='type'>({{type}})</span><span class='ep'></span></div>",
        link: function(scope, element, attrs){
            var origElem = element.get(0);
            var canvas = $("#board");
            var plumbBoard = window.plumbBoard;
            var stateMachineConnectorParams = {
                connector:"StateMachine",
                paintStyle:{lineWidth:3,strokeStyle:"#056"},
                hoverPaintStyle:{strokeStyle:"#056"},
                anchor:"Continuous",
            };

            function readOffset(title){
                var storage = localStorage.componentPositions ? JSON.parse(localStorage.componentPositions) : {};
                return {
                    left: storage[title] && storage[title].left,
                    top : storage[title] && storage[title].top
                }
            }
            function writeOffset(title,offset){
                var storage = localStorage.componentPositions ? JSON.parse(localStorage.componentPositions) : {};
                storage[title] = offset;
                localStorage.componentPositions = JSON.stringify(storage);
            }

            function setPosition(elem, size){
                var title = scope.title;
                var _offset = readOffset(title);
                var left =  _offset.left || Math.random() * (size.width - elem.width());
                var top = _offset.top ||  Math.random() * (size.height - elem.height());
                elem.css({
                    left: left,
                    top: top
                });
            }

            setPosition(element,{
                width: canvas.width(),
                height: canvas.height()
            });

            plumbBoard.makeSource(origElem, {
                filter: ".ep", // only for jquery
                anchor: "Continuous",
                connector: ["StateMachine", {
                    curviness: 20
                }],
                connectorStyle: {
                    strokeStyle: "#5c96bc",
                    lineWidth: 2,
                    outlineColor: "transparent",
                    outlineWidth: 4
                },
            });

            plumbBoard.makeTarget(origElem, {
                anchor: "Continuous",
                dropOptions: {
                    hoverClass: "dragHover"
                },
                maxConnections: 5,
                onMaxConnections: function(info, e) {
                    alert("Maximum connections (" + info.maxConnections + ") reached");
                }
            });

            $timeout(function(){
                if(scope.segues){
                    scope.segues.forEach(function(segue){
                        var connection=plumbBoard.connect({
                            source:origElem,
                            target:$("[ng-title=" + segue.to + "]").get(0),

                            connector:"StateMachine",
                            paintStyle:{lineWidth:3,strokeStyle:"#056"},
                            hoverPaintStyle:{strokeStyle:"#056"},
                            anchor:"Continuous",
                        });
                        connection.bind('click',function(conn){
                            scope.onEditConnection({
                                $connection:conn,
                                $segue:segue
                            });
                        })
                    });
                }
            },0);

            plumbBoard.draggable(element, {
                containment:"#board",
                stop: function(){
                    writeOffset(scope.title, {
                        left: parseInt(element.css("left"),10),
                        top: parseInt(element.css("top"),10)
                    });
                }
            });

        }
    }
}]);

app.controller('configCtrl', ['$scope', function($scope){
    $scope.config = window.config;
    $scope.types = window.types;
    $scope.nameToAdd = "";
    $scope.selectedType = Object.keys($scope.config.components)[0];
    var plumbBoard = window.plumbBoard;
    $scope.addConfig = function(){
        var key = $scope.nameToAdd;
        var type = $scope.selectedType;
        if($scope.config.components[key]){
            return alert("Key " + key + "already exists");
        }else{
            $scope.config.components[key] = {
                segues: [],
                type: type
            }
        }
    }

    $scope.doSth = function($connection, $segue){
        console.log($connection,this,$segue);
    }

    plumbBoard.bind("connectionDragStop",function(connection){
        var sourceTitle = angular.element(connection.source).scope().key;
        var targetTitle = angular.element(connection.target).scope().key;
        $scope.$apply(function(){
            var segues = $scope.config.components[sourceTitle].segues = $scope.config.components[sourceTitle].segues || [];
            segues.push({
                func: "",
                to: targetTitle
            });
        });
        return true;
    });
}]);


jsPlumb.ready(function() {
    window.plumbBoard = jsPlumb.getInstance({
        Endpoint: ["Dot", {
            radius: 2
        }],
        HoverPaintStyle: {
            strokeStyle: "#1e8151",
            lineWidth: 2
        },
        ConnectionOverlays: [
            ["Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8
            }],
            ["Label", {
                label: "edit",
                id: "label",
                cssClass: "aLabel"
            }]
        ],
        Container: "board"
    });


    angular.bootstrap(document, ["spiderman"]);

    // window.createNewNode = function(){
    //  var node = $('<div class="component window" id="window8"><strong>Window 8</strong></div>');
    //  node.appendTo($("#kitchensink-demo"));
    //  jsPlumb.draggable(node,{containment:"#board"});
    // }

    // jsPlumb.draggable($(".window"), { containment:"#board"});


});