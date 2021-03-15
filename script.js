
var movie_counter = 0;
var some_films = false;
var no_more_films = false;
var request_counter = 0;
var last_added = null;

function add_loaded(img) {
    if (last_added === null) {
        $(img).parent().parent().detach().prependTo($("#movie_list"))
    } else {
        $(img).parent().parent().detach().insertAfter($(last_added).parent().parent())
    }
    last_added = img;
}

function wait_for_stop (data) {
    if (request_counter > 0) {
        window.setTimeout(() => {
            wait_for_stop(data);
        }, 500);
        return;
    }
    ix = some_films ? 1 : 2;
    message = data.split('%')[ix];
}

function add_movies() {
    request_counter += 1;

    // Numer of movies in one row
    let elms = Math.floor($("#movie_list").width() / 124);

    // Number of movies that need to be added to fill the last row
    let rowf = elms * Math.ceil(movie_counter / elms) - movie_counter;

    let limit;
    let page;
    // Request a new full row if the last row is already full
    if (rowf == 0) {
        limit = elms;
    } else {
        for (limit = rowf; limit > 0; limit--) {
            if ((movie_counter / limit) % 1 == 0)
                break;
        }
    }
    page = movie_counter/limit

    movie_counter += limit;

    let url = `list${page}.html`;
    let add = function( data ) {
        $('#movie_list').append(data);
    }
    $.get(url, add);
}


function check_add_movies() {
    if (no_more_films == true) {
        return;
    }
    var doc_height = $(document).height();
    var win_height = $(window).height();
    if (doc_height <= win_height || amountscrolled() < 1000) {
        add_movies();
        window.setTimeout(() => {
            check_add_movies();
        }, 300);
    } else {
        window.setTimeout(() => {
            check_add_movies();
        }, 500);
    }
}

function getDocHeight() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    )
}

function amountscrolled() {
    var winheight= window.innerHeight || (document.documentElement || document.body).clientHeight
    var docheight = getDocHeight()
    var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
    var trackLength = docheight - winheight
    var bot = trackLength - scrollTop // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)
    return bot;
}

function refresh_ratings(movie_overlay) {
    return;
    var ratings = $(movie_overlay).parent().children('.icon_overlay').children('.ratings');
    var movie_id = $(movie_overlay).parent().children('movie-id').attr("movieid");
    $.get(`php/get_rating.php?movie_id=${movie_id}&list_id=0`, function (data) {
        ratings.children('.rating_explore').text(data);
    });
    $.get(`php/get_rating.php?movie_id=${movie_id}&list_id=1`, function (data) {
        ratings.children('.rating_liked').text(data);
    });
}

if (typeof dont_load_now === 'undefined') {
    $(document).ready(function(){
        check_add_movies();
    });
}

