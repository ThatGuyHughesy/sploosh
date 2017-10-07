var client_id = '<CLIENT_ID_HERE>';
var api_url = 'https://api.unsplash.com/photos/random?client_id=';
var unsplash_url = 'https://unsplash.com';
var unsplash_utm = '?utm_source=sploosh&utm_medium=referral&utm_campaign=api-credit';
var current_photo = {};
var next_photo = {};
var pinned = 0;

$(document).ready(function () {

    function loadData() {
        if (localStorage.getItem('pinned')) {
            pinned = localStorage.getItem('pinned');
        }
        if (localStorage.getItem('current_photo')) {
            current_photo = JSON.parse(localStorage.getItem('current_photo'));
        }
        if (localStorage.getItem('next_photo')) {
            next_photo = JSON.parse(localStorage.getItem('next_photo'));
        }
        setPin();
    }

    function encodeImage(src, callback, outputFormat) {
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL);
        };
        img.src = src;
        if (img.complete || img.complete === undefined) {
            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            img.src = src;
        }
    }

    function savePhoto() {
        localStorage.clear();
        localStorage.setItem('current_photo', JSON.stringify(current_photo));
        localStorage.setItem('next_photo', JSON.stringify(next_photo));
    }

    function getRandomPhoto() {
        var url = api_url + client_id;
        return $.ajax({
            url: url,
            success: function (response) {
                encodeImage(
                    response.urls['regular'],
                    function (data) {
                        next_photo = {
                            'author': response.user.name,
                            'link': response.links.html,
                            'src': data
                        };
                        savePhoto();
                    }
                );
            }
        });
    }

    function setBackground(author, link, src) {
        $('#background').attr('src', src);
        $('#author').html('Photo by <a href=\"' + link + unsplash_utm + '\" target=\"_blank\">' + author + '</a> / <a href=\"' + unsplash_url + unsplash_utm + '\">Unsplash</a>');
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

    function randomPhoto() {
        if (pinned == 0) {
            current_photo = next_photo;
	    setBackground(current_photo.author, current_photo.link, current_photo.src);
            getRandomPhoto();
        }
    }

    function init() {
        loadData();
        if ($.isEmptyObject(current_photo)) {
            current_photo = default_photo;
            getRandomPhoto();
        } else {
            randomPhoto();
        }
        setBackground(current_photo.author, current_photo.link, current_photo.src);
    }

    $("#pin").click(function () {
        pin();
    });

    $("#random").click(function () {
        randomPhoto();
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 32) {
            randomPhoto();
        }
    });

    init();
});
