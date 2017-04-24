$(window).on('load', function() {
    $('#app').fadeIn(2000)
    $('#app').css('display', 'flex');
    $('.spinner').fadeOut("fast");
});

//API KEY bf39974e4cd838de19bec9f9e381cb10

let movieIds = [];
let savedMovieIds = [];

$(document).ready(function() {

    //========TRENDING MOVIES=======================================
    //========TRENDING MOVIES=======================================
    //========TRENDING MOVIES=======================================

    $("#getTrendingMovies").click(function() {


        $("#movieInfo").empty();
        movieIds = [];

        $.ajax({
            type: "GET",
            url: "https://api.themoviedb.org/3/discover/movie?api_key=bf39974e4cd838de19bec9f9e381cb10&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1",
            success: function(data) {
                // console.log(data.results[0].id)
                let movieData = data.results;
                let saveButton = "<button type='button' class='save-button' onclick=saveMovie(this,movieIds,savedMovieIds)>+</button>";
                $("#movieInfo").append("<div id='trending'><h2 class='section-title'>Now Playing</h2></div>");

                movieData.forEach(function(element, index) {
                    movieIds.push(data.results[index].id)
                    //if id in movieIds matches id in savedMovieIds, print version without add button
                    //else print version with button so it can be added
                    let posterUrl = "https://image.tmdb.org/t/p/w640" + data.results[index].poster_path;
                    let placeholder = "<div class='placeholder'></div>";

                    if (posterUrl === "https://image.tmdb.org/t/p/w640null") {
                        posterImg = placeholder
                    } else {
                        posterImg =
                            "<img class='poster' onload='fadeIn(this)' src=" + posterUrl + " alt='movie poster' style='display:none'/>";
                    }

                    let description = data.results[index].overview;
                    if (description.length > 300) {
                        description = data.results[index].overview.slice(0, 300) + "...";
                    }


                    $("#trending").append("<div class='moviePanel'>" + posterImg + "<div class='movieText'><h1 class='movieTitle'>" +
                        data.results[index].title + "</h1><h2 class='rating'>★ " + " " + data.results[index].vote_average + "</h2><p>" + description + "</p>" + saveButton + "</div></div>");
                }); //forEach
                console.log("ARR OF IDS CURRENTLY ON PAGE: " + movieIds);
            } //success
        }); //ajax
    }); //onclick

    //========SEARCHED MOVIES=======================================
    //========SEARCHED MOVIES=======================================
    //========SEARCHED MOVIES=======================================

    $("#searchForm").submit(function(e) {
        e.preventDefault();
        let searchQuery = document.getElementById("searchInput").value;
        let saveButton = "<button type='button' class='save-button' onclick=saveMovie(this,movieIds,savedMovieIds)>+</button>";

        $("#movieInfo").empty(); //clear out movieInfo div
        movieIds = []; //clear out the IDs for new IDs on page to be pushed to arr

        $.ajax({
            type: "GET",
            url: "https://api.themoviedb.org/3/search/movie?api_key=bf39974e4cd838de19bec9f9e381cb10&language=en-US&query=" + searchQuery + "&page=1&include_adult=false",
            success: function(data) {
                // $("#data").text(data[])
                // console.log(data.results[0])
                let movieData = data.results;

                $("#movieInfo").append("<div id='searched'><h2 class='section-title'>Search Results</h2></div>");

                console.log(data)

                movieData.forEach(function(element, index) {
                    movieIds.push(data.results[index].id)

                    let posterUrl = "https://image.tmdb.org/t/p/w640" + data.results[index].poster_path;
                    let placeholder = "<div class='placeholder'></div>";

                    if (posterUrl === "https://image.tmdb.org/t/p/w640null") {
                        posterImg = placeholder
                    } else {
                        posterImg =
                            "<img class='poster' onload='fadeIn(this)' src=" + posterUrl + " alt='movie poster' style='display:none'/>";
                    }

                    let description = data.results[index].overview;
                    if (description.length > 300) {
                        description = data.results[index].overview.slice(0, 300) + "...";
                    }

                    $("#searched").append("<div class='moviePanel'>" + posterImg + "<div class='movieText'><h1 class='movieTitle'>" +
                        data.results[index].title + "</h1><h2 class='rating'>★" + " " + data.results[index].vote_average + "</h2><p>" + description + "</p>" + saveButton + "</div></div>"
                    );
                }); //forEach
                console.log("ARR OF IDS CURRENTLY ON PAGE: " + movieIds);
            } //success
        }); //ajax
    }); //submit

    //========SAVED MOVIES=======================================
    //========SAVED MOVIES=======================================
    //========SAVED MOVIES=======================================

    $("#getSavedMovies").on('click', function() {

        let removeButton = "<button type='button' class='remove-button' onclick=removeMovie(this,movieIds,savedMovieIds)>-</button>";
        $("#movieInfo").empty();
        $("#movieInfo").append("<div id='saved'><h2 class='section-title'>Saved Movies</h2></div>");

        if (savedMovieIds.length === 0) {
        $("#saved").append("<p class='no-movies-saved'>You have nothing saved!</p>")
        } else {

        savedMovieIds.forEach(function(element) {
            $.ajax({
                type: "GET",
                url: "https://api.themoviedb.org/3/movie/" + element + "?api_key=bf39974e4cd838de19bec9f9e381cb10&language=en-US",
                success: function(data) {
                    //dont need to specify index

                    let posterUrl = "https://image.tmdb.org/t/p/w640" + data.poster_path;
                    let placeholder = "<div class='placeholder'></div>";

                    if (posterUrl === "https://image.tmdb.org/t/p/w640null") {
                        posterImg = placeholder
                    } else {
                        posterImg =
                            "<img class='poster' onload='fadeIn(this)' src=" + posterUrl + " alt='movie poster' style='display:none'/>";
                    }



                    $("#searched").remove()

                    // let poster = "https://image.tmdb.org/t/p/w640" + data.poster_path;
                    // console.log(data.results[0].id)
                    $("#saved").append("<div class='moviePanel'>" + posterImg + "<div class='movieText'><h1 class='movieTitle'>" +
                        data.title + "</h1><h2 class='rating'>★ " + " " + data.vote_average + "</h2><p>" + data.overview + "</p>" + removeButton + "</div></div>");
                    console.log(data.poster_path)

                } //success
            }); //ajax
        }); //forEach
        }

    });

}); //document ready


function fadeIn(obj) {
    $(obj).fadeIn(1000);
}

function saveMovie(button, arr, storageArr) {
    //in AJAX request, create an array when the data is loaded and store the IDs in order
    //on click, retrieve the corresponding one with the index
    $(button).prop('disabled', true);
    $(button).css('font-size', '14px').text('saved!');
    let index = $(button).parent().parent().index();
    console.log("index:" + index);
    let movieId = arr[index - 1]; //adding and h1 to the initial div changes the index + 1
    storageArr.push(movieId);
    console.log("STORED IDs: " + storageArr);
}

function removeMovie(button, arr, storageArr) {
    let parent = $(button).parent().parent();
    let index = $(button).parent().parent().index();
    storageArr.splice(index, 1); //remove movie id from array
    $(parent).remove(); //remove respective div from saved movies
    console.log("index:" + index);
    console.log("parent:" + parent);
    console.log("STORED IDs: " + storageArr);
}
