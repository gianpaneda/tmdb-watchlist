//API KEY bf39974e4cd838de19bec9f9e381cb10

$(window).on('load', function() {
    $('#app').fadeIn(1000)
    $('#app').css('display', 'flex');
    $('.spinner').fadeOut(100);
});

let movieIds = [];
let savedMovieIds = [];
let savedMovieTitles = [];

$(document).ready(function() {

    let count = 1;
    let saveButton = "<button type='button' class='save-button' onclick=saveMovie(this,movieIds,savedMovieIds)>+</button>";

    function nextPage() {
        console.log("count:" + count);
        if (count === 2) {
            count++;
            moviesByGenre(count);
        } else {
            count++;
            moviesByGenre(count);
        }
    }

    function prevPage() {
        if (count < 3) {
            $("#decrease").hide();
            count--;
            moviesByGenre(count);
        } else {
            count--;
            moviesByGenre(count);
        }
    }

    $("#getNowPlaying").on("click", nowPlaying);
    $("#getSavedMovies").on("click", savedMovies);

    $("#searchForm").on("submit", searchMovies);

    $("#genres").on("change", function() {
        moviesByGenre(count);
    });

    $("#movieInfo").on("click", "#increase", function() {
        nextPage();
    });

    $("#movieInfo").on("click", "#decrease", function() {
        prevPage();
    });

    function searchMovies(e, pagecount) {
        e.preventDefault();
        $("#download-button").hide();
        let page = 1;
        let searchQuery = document.getElementById("searchInput").value;
        $('#genres').prop('selectedIndex', 0);


        $("#movieInfo").empty(); //clear out movieInfo div
        movieIds = []; //clear out the IDs for new IDs on page to be pushed to arr

        $.ajax({
            type: "GET",
            url: "https://api.themoviedb.org/3/search/movie?api_key=bf39974e4cd838de19bec9f9e381cb10&language=en-US&query=" + searchQuery + "&page=" + pagecount + "&include_adult=false",
            success: function(data) {

                let movieData = data.results;

                $("#movieInfo").append("<div id='searched'><h2 class='section-title'>Search Results</h2></div>");

                movieData.forEach(function(element, index) {
                    movieIds.push(data.results[index].id);

                    let posterUrl = "https://image.tmdb.org/t/p/w640" + data.results[index].poster_path;
                    let description = data.results[index].overview;
                    let placeholder = "<div class='placeholder'></div>";

                    if (posterUrl === "https://image.tmdb.org/t/p/w640null") {
                        posterImg = placeholder;
                    } else {
                        posterImg = "<img class='poster' onload='fadeIn(this)' src=" + posterUrl + " alt='movie poster' style='display:none'/>";
                    }

                    if (description.length > 450) {
                        description = data.results[index].overview.slice(0, 450) + "...";
                    }

                    $("#searched").append("<div class='moviePanel'>" + posterImg + "<div class='movieText'><h1 class='movieTitle'>" +
                        data.results[index].title + "</h1><h2 class='rating'>★" + " " + data.results[index].vote_average + "</h2><p>" + description + "</p>" + saveButton + "</div></div>"
                    );
                }); //forEach
                console.log("ARR OF IDS CURRENTLY ON PAGE: " + movieIds);
            } //success
        }); //ajax
    }; //submit

    function nowPlaying() {

        $("#movieInfo").empty();
        $("#download-button").hide();
        $('#genres').prop('selectedIndex', 0);
        movieIds = [];

        $.ajax({
            type: "GET",
            url: "https://api.themoviedb.org/3/discover/movie?api_key=bf39974e4cd838de19bec9f9e381cb10&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1",
            success: function(data) {
                let movieData = data.results;
                let saveButton = "<button type='button' class='save-button' onclick=saveMovie(this,movieIds,savedMovieIds)>+</button>";

                $("#movieInfo").append("<div id='trending'><h2 class='section-title'>Trending</h2></div>");
                movieData.forEach(function(element, index) {
                    let year = movieData[index].release_date.slice(0, 4);
                    let description = data.results[index].overview;
                    let posterUrl = "https://image.tmdb.org/t/p/w640" + data.results[index].poster_path;
                    let placeholder = "<div class='placeholder'></div>";

                    movieIds.push(data.results[index].id + " (" + year + ")");

                    if (posterUrl === "https://image.tmdb.org/t/p/w640null") {
                        posterImg = placeholder
                    } else {
                        posterImg = "<img class='poster' onload='fadeIn(this)' src=" + posterUrl + " alt='movie poster' style='display:none'/>";
                    }

                    if (description.length > 300) {
                        description = data.results[index].overview.slice(0, 300) + "...";
                    }

                    $("#trending").append("<div class='moviePanel'>" + posterImg + "<div class='movieText'><h1 class='movieTitle'>" +
                        data.results[index].title + " (" + year + ")</h1><h2 class='rating'>★ " + " " + data.results[index].vote_average + "</h2><p>" + description + "</p>" + saveButton + "</div></div>");
                }); //forEach
                console.log("ARR OF IDS CURRENTLY ON PAGE: " + movieIds);

            } //success
        }); //ajax
    } //onclick

    function savedMovies() {

        let removeButton = "<button type='button' class='remove-button' onclick='removeMovie(this,movieIds,savedMovieIds,savedMovieTitles)'>-</button>";
        savedMovieTitles = [];

        $("#movieInfo").empty();
        $("#download-button").show();
        $('#genres').prop('selectedIndex', 0);
        $("#movieInfo").append("<div id='saved'><h2 class='section-title'>Saved Movies</h2></div>");

        if (savedMovieIds.length === 0) {
            $("#saved").append("<p class='no-movies-saved'>You have nothing saved!</p>")
        } else {
            savedMovieIds.forEach(function(element) { //index doesnt need to be specified
                let id = element;


                $.ajax({
                    type: "GET",
                    url: "https://api.themoviedb.org/3/movie/" + element + "?api_key=bf39974e4cd838de19bec9f9e381cb10&language=en-US",
                    success: function(data) {

                        let posterUrl = "https://image.tmdb.org/t/p/w640" + data.poster_path;
                        let title = data.title + " (" + data.release_date.slice(0, 4) + ")"
                        let placeholder = "<div class='placeholder'></div>";
                        let description = data.overview;

                        savedMovieTitles.push(title);
                        $("#searched").remove();

                        if (posterUrl === "https://image.tmdb.org/t/p/w640null") {
                            posterImg = placeholder
                        } else {
                            posterImg = "<img class='poster' onload='fadeIn(this)' src=" + posterUrl + " alt='movie poster' style='display:none'/>";
                        }

                        if (description.length > 450) {
                            description = data.overview.slice(0, 450) + "...";
                        }


                        $("#saved").append("<div class='moviePanel'>" + posterImg + "<div class='movieText'><h1 class='movieTitle'>" +
                            title + "</h1><h2 class='rating'>★ " + " " + data.vote_average + "</h2><p>" + description + "</p>" + removeButton + "</div></div>");
                        console.log("savedMovieTitles:" + savedMovieTitles);

                    } //success
                }); //ajax
            }); //forEach
        }
    }; //getSavedMovies

    function moviesByGenre(pagecount) {

        $("#movieInfo").empty();
        $("#download-button").hide();
        movieIds = [];
        let genre = $("#genres").val();

        console.log("genre:" + genre);
        console.log(pagecount);

        $.ajax({
            type: "GET",
            url: "https://api.themoviedb.org/3/genre/" + genre + "/movies?api_key=bf39974e4cd838de19bec9f9e381cb10&language=en-US&include_adult=false&sort_by=created_at.asc&page=" + pagecount,
            success: function(data) {

                let movieData = data.results;

                $("#movieInfo").append("<div id='genre'><h2 class='section-title'>" + $("#genres option:selected").text() + "</h2></div>");

                movieData.forEach(function(element, index) {
                    movieIds.push(data.results[index].id);

                    let posterUrl = "https://image.tmdb.org/t/p/w640" + data.results[index].poster_path;
                    let placeholder = "<div class='placeholder'></div>";

                    if (posterUrl === "https://image.tmdb.org/t/p/w640null") {
                        posterImg = placeholder;
                    } else {
                        posterImg =
                            "<img class='poster' onload='fadeIn(this)' src=" + posterUrl + " alt='movie poster' style='display:none'/>";
                    }

                    let description = data.results[index].overview;
                    if (description.length > 450) {
                        description = data.results[index].overview.slice(0, 450) + "...";
                    }

                    $("#genre").append("<div class='moviePanel'>" + posterImg + "<div class='movieText'><h1 class='movieTitle'>" +
                        data.results[index].title + "</h1><h2 class='rating'>★" + " " + data.results[index].vote_average + "</h2><p>" + description + "</p>" + saveButton + "</div></div>")
                });
                console.log("ARR OF IDS CURRENTLY ON PAGE: " + movieIds);
                $("#genre").append("<button id='decrease' class='page-button' type='button'>PREV PAGE</button>");
                $("#genre").append("<button id='increase' class='page-button' type='button'>NEXT PAGE</button>");
                if (count === 1) {
                    $("#decrease").hide();
                }
            }
        });
    }

}); //document ready

function downloadInnerHtml(filename, elId, mimeType) {
    // var elHtml = document.getElementById(elId).innerHTML;
    let list = "";

    savedMovieTitles.forEach(function(element) {
        list += element + "\n";
    });

    var elHtml = list;
    var link = document.createElement('a');
    mimeType = mimeType || 'text/plain';

    link.setAttribute('download', filename);
    link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
    link.click();
}

var fileName = 'TMDB-Watchlist.txt'; // You can use the .txt extension if you want

$('#download-button').click(function() {
    downloadInnerHtml(fileName, 'main', 'text/html');
});


function fadeIn(obj) {
    $(obj).fadeIn(1000);
}

function saveMovie(button, arr, storageArr) {
    //in AJAX request, create an array when the data is loaded and store the IDs in order
    //on click, retrieve the corresponding id using index
    $(button).prop('disabled', true);
    $(button).css('font-size', '14px').text('saved!');
    let index = $(button).parent().parent().index();
    console.log("index:" + index);
    let movieId = arr[index - 1]; //adding an h1 to the initial div changes the index + 1
    storageArr.push(movieId);
    console.log("STORED IDs: " + storageArr);
}

function removeMovie(button, arr, storageArr, titlesArr) {
    let parent = $(button).parent().parent();
    let index = $(button).parent().parent().index();
    storageArr.splice(index - 1, 1); //remove movie id from array
    titlesArr.splice(index - 1, 1); //remove movie title from array
    $(parent).remove(); //remove respective div from saved movies
    console.log("index:" + index);
    console.log("STORED IDs: " + storageArr);
    console.log("titlesArr: " + titlesArr);
}
