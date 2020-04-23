var app = angular.module('ToDoList', []);
var omdbkey = 'e011453f' //6f73b15c


app.controller('mainCont', ['$scope', function($scope) {
    $scope.episodes = [];
    $scope.scores = [];
    $scope.poster = "no-img.jpg";
    $scope.plot = "";

    var seasonRemaining = 100;
    var scoresDict = {};
    var nSeason;

    $scope.click = function () {
        newShow();
    }

    $scope.inputKeypress = function(event) {
        if (event.keyCode == 13 || event.which == 13){
            newShow();
        }
    }

    function newShow() {
        reqString = 'https://www.omdbapi.com/?t=' + encodeURI($scope.showName) + '&apikey=' + omdbkey
        console.log(reqString);

        $.getJSON(reqString).then(function(response) {
            if(response.Response = "True") {
                
                if(response.Type == "movie") {
                    alert("Mmh, looks like " + $scope.showName + " is a movie...");
                    return;
                }

                scores = {};

                //update poster
                if(response.Poster != "N/A") {
                    $scope.poster = response.Poster;
                }

                if(response.Plot != "N/A") {
                    $scope.plot = response.Plot;
                }

                seasonRemaining = parseInt(response.totalSeasons);
                nSeason = parseInt(response.totalSeasons);

                for(var season = 1; season <= response.totalSeasons; season++) {
                    reqString = 'https://www.omdbapi.com/?t=' + encodeURI($scope.showName) + '&season=' + season + '&apikey=' + omdbkey
                    console.log(reqString);
                    newSeason(reqString, postSeasons);
                }

            }        
        })
    }

    function postSeasons() {
        //wait for all seasons to be processed
        if(seasonRemaining <= 0) {       
            $scope.scores = scoreToArray(scoresDict);
            $scope.episodes = [...Array(parseInt(maxEp)).keys()];
            $scope.$apply();

            colorCells();
        }


    }

    function newSeason(reqString, callback) {
        $.getJSON(reqString).then(function(response) {
            epScores = {};
			$.each(response.Episodes, function(i, item) {
                epScores[item.Episode] = [item.imdbRating, item.Title];
            });
            scoresDict[response.Season] = epScores;
            
            seasonRemaining--;
            callback();
        })
    }

    function scoreToArray(dict) {
        maxEp = -1;
        var scoresArray = [];
        for(var s = 1; s <= nSeason; s++) {
    
            var score = [];
    
            var eMax = Math.max.apply(Math,Object.keys(dict[s]).map(x=>+x));
            maxEp = Math.max(maxEp, eMax)
            for(var e = 1; e <= eMax; e++) {
                if(dict[s][e] == undefined) {
                    score.push(["N/A","?"]);
                } else {
                    score.push(dict[s][e]);
                }
            }
    
            scoresArray.push(score);
        }
    
        return scoresArray;
    }

}]);

function colorCells() {
    var colors = ["#dc0000","#dc0000","#dc0000","#dc2c00","#dc5800","#dc8400","#dcb000","#dcdc00","#84dc00","#2cdc00"];

    $('#score_table td.ratingColor').each(function(){

        if($(this).text() == "N/A") {
            $(this).css('background-color','grey');
        } else {
            var value = parseInt($(this).text());
            $(this).css('background-color',colors[Math.round(value)]);
        }
    })
}