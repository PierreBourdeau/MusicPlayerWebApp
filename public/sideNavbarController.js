var preloader = document.getElementById('preloader');
var ppInput;
var ppForm;
var createPlaylistInput;
var playlistRow;
var musicMenu;
var favoriteMenu;

function updateSideNavBar() {
    favoriteMenu = document.getElementById('favorites-btn');
    favoriteMenu.addEventListener('click', function () {
        displayFavoritesMenu();
    })
    musicMenu = document.getElementById('music-btn');
    musicMenu.addEventListener('click', function () {
        displayMusicMenu();
    })
    ppInput = document.getElementById('profilePictureInput');
    ppForm = document.getElementById('profilePictureForm');
    ppInput.onchange = function () {
        updateProfilePicture();
    }
    createPlaylistInput = document.getElementById('createPlaylistInput');
    createPlaylistInput.addEventListener('keyup', function (e) {
        createPlaylist(e);
    });
    playlistRow = document.querySelectorAll('*[id^="playlist-row"]');
    for (let i = 0; i < playlistRow.length; i++) {
        playlistRow[i].addEventListener('click', function () {
            loadPlaylist(this);
        });
        playlistRow[i].addEventListener('dragover', dragOver);

        playlistRow[i].addEventListener('dragenter', dragEnter);

        playlistRow[i].addEventListener('dragleave', dragLeave);

        playlistRow[i].addEventListener('drop', dragDrop);
    }
}
updateSideNavBar();

function displayMenu(url) {
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'html',
        beforeSend: () => {
            preloader.style.display = 'block';
        },
        complete: () => {
            preloader.style.display = 'none';
        },
        success: (resp) => {
            $('#song-tab').html(resp);
            updatesongRow();
        }
    })
}

function displayMusicMenu() {
    displayMenu('/loadLibrary');
}
function displayFavoritesMenu() {
    displayMenu('/loadFavoritesLibrary');
}

function loadPlaylist(playlist) {
    $.ajax({
        type: 'POST',
        url: '/loadPlaylist',
        data: { playlistId: playlist.getAttribute('data-playlist-id')},
        dataType: 'html',
        beforeSend: function () {
            preloader.style.display = 'block';
        },
        complete: function () {
            preloader.style.display = 'none';
        },
        success: function (resp) {
            $('#song-tab').html(resp);
            updatesongRow();
        }
    })
}

function updateProfilePicture() {
    if (ppInput.files.length > 0 && ppFormVerify(ppInput.value)) {
        var fData = new FormData(ppForm);
        $.ajax({
            type: 'POST',
            url: '/pp',
            data: fData,
            dataType: 'html',
            processData: false,
            contentType: false,
            success: function (resp) {
                $('#side-navbar').html(resp);
                updateSideNavBar();
            }
        })
    }
}

function ppFormVerify(file) {
    let res = false;
    const exceptedSongFiles = ['jpg', 'png', 'jpeg'];
    if (exceptedSongFiles.includes(file.split('.').pop())) {
        res = true;
    }
    return res;
}


function createPlaylist(e) {
    if (createPlaylistInput.value.length > 0) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            $.ajax({
                type: 'POST',
                url: '/createPlaylist',
                data: { playlistName: createPlaylistInput.value },
                dataType: 'html',
                success: function (resp) {
                    $('#side-navbar').html(resp);
                    updateSideNavBar();
                }
            })
        }
    }
}