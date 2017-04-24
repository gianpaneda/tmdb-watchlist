let movieIds = [];
let savedMovieIds = [];

$(document).ready(function() {

    //========TRENDING MOVIES=======================================
    //========TRENDING MOVIES=======================================
    //========TRENDING MOVIES=======================================

    $("#getTrendingMovies").click(function() {
        $.ajax({
            type: "GET",
            url: "https://api.themoviedb.org/3/discover/movie?api_key=bf39974e4cd838de19bec9f9e381cb10&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1",
            success: function(data) {
                console.log(data)
            } //success
        }); //ajax
    }); //onclick

});

// function fadeIn(obj) {
//     $(".placeholder").hide();
//     $(obj).fadeIn(1000);
// }
//
// function addMovie(button, arr, storageArr) {
//     //in AJAX request, create an array when the data is loaded and store the IDs in order
//     //on click, retrieve the corresponding one with the index
//     $(button).prop('disabled', true)
//     let index = $(button).parent().index();
//     let movieId = arr[index]
//     storageArr.push(movieId)
//     console.log("STORED IDs: " + storageArr)
// }
//
// function removeMovie(button, arr, storageArr) {
//
// }
