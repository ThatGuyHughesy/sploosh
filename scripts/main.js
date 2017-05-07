var client_id = '<CLIENT_ID_HERE>';
var api_url = 'https://api.unsplash.com/photos/random?client_id=';
var unsplash_url = 'https://unsplash.com';
var unsplash_utm = '?utm_source=sploosh&utm_medium=referral&utm_campaign=api-credit';
var image_quality = 'regular';
var photo = {};
var pinned = 0;

$(document).ready(function () {

    function loadSettings() {
        if (localStorage.getItem('pinned')) {
            pinned = localStorage.getItem('pinned');
        }
        setPin();
    }

    function loadPhoto() {
        photo = JSON.parse(localStorage.getItem('photo'));
    }

    function savePhoto() {
        localStorage.setItem('photo', JSON.stringify(photo));
    }

    function randomPhoto() {
        var url = api_url + client_id;
        return $.ajax({
            url: url,
            success: function (response) {
                photo = {
                    'author': response.user.name,
                    'link': response.links.html,
                    'urls': response.urls
                };
                savePhoto();
                setBackground(photo.author, photo.link, photo.urls[image_quality]);
            }
        });
    }

    function getPhoto() {
        if (pinned == 0) {
            randomPhoto();
        } else {
            loadPhoto();
            setBackground(photo.author, photo.link, photo.urls[image_quality]);
        }
    }

    function setBackground(author, link, url) {
        var date = new Date();
        $(new Image()).attr('src', url + '?' + date.getTime()).load(function () {
            $('#photo').attr('src', this.src);
            $('#author').html('Photo by <a href=\"' + link + unsplash_utm + '\" target=\"_blank\">' + author + '</a> / <a href=\"' + unsplash_url + unsplash_utm + '\">Unsplash</a>');

            var loader = $('#loader');
            if (loader.is(":visible")) {
                loader.delay(1000).fadeOut(500);
            }

            var random = $('#random');
            if (random.is(":hidden")) {
                random.show();
            }

            var loading = $('#random-loading');
            if (loading.is(":visible")) {
                loading.hide();
            }
        });
    }

    function pin() {
        if (pinned == 0) {
            pinned++;
        } else {
            pinned--;
        }
        localStorage.setItem('pinned', pinned);
        setPin();
    }

    function setPin() {
        if (pinned == 1) {
            $('#pin').css("opacity", "1");
            $('#top-right').hide();
        } else {
            $('#pin').css("opacity", "0.5");
            $('#top-right').show();
        }
    }

    function random() {
        if (pinned == 0) {
            $('#random').hide();
            $('#random-loading').show();
            randomPhoto();
        }
    }

    function init() {
        loadSettings();
        getPhoto();
    }

    $("#pin").click(function () {
        pin();
    });

    $("#random-button").click(function () {
        random();
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 32) {
            random();
        }
    });

    init();
});
