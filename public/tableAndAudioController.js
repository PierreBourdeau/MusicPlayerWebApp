var musicSlider = document.getElementById("music_slider");
var songCurrentTime = document.getElementById("music_current_time");
var songDuration = document.getElementById("music_duration");
var songPicture = document.getElementById("songPicture");
var playPauseButton = document.getElementById("play_pause_button");
var currentVolume = document.getElementById('volume_slider');
var songTitle = document.getElementById('songTitle');
var artistName = document.getElementById('artistName');
var volumeIcon = document.getElementById('volume-icon');
var bottomPlayBar = document.getElementById('bottomplay-bar');
var songRow;
var activeSong;
var isPlaying = false;
var draggedRow;
var sorting = 'alpha';
var player = new Audio();

function updatesongRow() {
    songRow = document.querySelectorAll('*[id^="song-row"]');
    activeSong = null;
    for (let i = 0; i < songRow.length; i++) {
        songRow[i].addEventListener('click', function () {
            if (activeSong !== null) {
                songRow[activeSong].style.background = 'var(--e-bg-color)';
            }
            activeSong = i;
            songRow[activeSong].style.background = 'var(--se-bg-color)';
            songInit(this);
        })
        songRow[i].addEventListener('dragstart', dragStart);
        songRow[i].addEventListener('dragend', dragEnd);
        if (songRow[i].getAttribute('data-favorite') !== '0') {
            songRow[i].querySelector('a.fav-btn i').classList.replace('far', 'fas');
        }
        songRow[i].querySelector('a.fav-btn').addEventListener('click', function () {
            addToFavorite(songRow[i]);
        })
    }
}
updatesongRow();

function searchFor() {
    console.log('Function called');

    var input, filter, table, tr, td, i, j, titleValue, artistValue;
    input = document.getElementById("searchBar");
    filter = input.value.toUpperCase();
    table = document.getElementById("songList");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = [tr[i].getElementsByTagName("td")[0], tr[i].getElementsByTagName("td")[1]];
        if (td) {
            titleValue = td[0].textContent || td[0].innerText;
            artistValue = td[1].textContent || td[1].innerText;
            if (titleValue.toUpperCase().includes(filter) || artistValue.toUpperCase().includes(filter)) {
                tr[i].style.display = "flex";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function sortTableCol(n) {
    document.querySelectorAll(' .song-table-header th *[class^="fa-sort"]').forEach(node => node.style.visibility = '');
    table = document.querySelector('#songList tbody');
    songRowArray = Array.prototype.slice.call(songRow);
    if (sorting == 'alpha') {
        songRowArray.sort(function (a, b) {
            if (a.getElementsByTagName('td')[n].innerHTML.toLowerCase() < b.getElementsByTagName('td')[n].innerHTML.toLowerCase()) { return -1; };
            if (a.getElementsByTagName('td')[n].innerHTML.toLowerCase() > b.getElementsByTagName('td')[n].innerHTML.toLowerCase()) { return 1; };
            return 0;
        })
        sorting = '!alpha';
        document.querySelectorAll('.song-table-header th')[n].querySelector('i').classList.replace('fa-sort-up','fa-sort-down');
    }
    else if (sorting == '!alpha') {
        songRowArray.sort(function (a, b) {
            if (a.getElementsByTagName('td')[n].innerHTML.toLowerCase() < b.getElementsByTagName('td')[n].innerHTML.toLowerCase()) { return 1; };
            if (a.getElementsByTagName('td')[n].innerHTML.toLowerCase() > b.getElementsByTagName('td')[n].innerHTML.toLowerCase()) { return -1; };
            return 0;
        })
        sorting = 'alpha';
        document.querySelectorAll('.song-table-header th')[n].querySelector('i').classList.replace('fa-sort-down', 'fa-sort-up');
    }
    document.querySelectorAll('.song-table-header th')[n].querySelector('i').style.visibility = 'visible';
    for (let i = 0; i < songRowArray.length; i++) {
        table.appendChild(songRowArray[i]);
    }
}

function startSong(path) {
    player.src = (path);
    player.load();
    player.addEventListener("canplaythrough", event => {
        isPlaying = true;
        playPauseSong();
        getDuration(player);
        bottomPlayBar.classList.add('animate-bottomBar');
        looper();
        player.play();
    });
}

function getDuration() {
    songDuration.innerHTML = formatTime(player.duration);
}

function formatTime(seconds) {
    minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
}

player.addEventListener('timeupdate', function () {
    var position = player.currentTime / player.duration;
    musicSlider.value = position * 100;
    songCurrentTime.innerHTML = formatTime(player.currentTime);
    musicSlider.style.background = 'linear-gradient(to right, #fff 0%, #fff ' + musicSlider.value + '%, #2d2d30 ' + musicSlider.value + '%, #2d2d30 100%)';
    if (player.volume == 0) {
        volumeIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
    }
    else {
        volumeIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
    }
});


function sliderPositionUpdate() {
    player.currentTime = player.duration * (musicSlider.value / 100);
}

function getSongInfos(picture, title, artist) {
   songPicture.src = picture;
    artistName.innerHTML = artist;
    songTitle.innerHTML = title;
}

function playPauseSong() {
    if (!isPlaying) {
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
        player.pause();
        isPlaying = true;
    }
    else {
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        player.play();
        isPlaying = false;
    }
}

function muteSound() {
    player.volume = 0;
    currentVolume.value = "0";
    currentVolume.style.background = 'linear-gradient(to right, #fff 0%, #fff ' + currentVolume.value + '%, #2d2d30 ' + currentVolume.value + '%, #2d2d30 100%)';
}

function updateVolume() {
    player.volume = currentVolume.value / 100;
    currentVolume.style.background = 'linear-gradient(to right, #fff 0%, #fff ' + currentVolume.value + '%, #2d2d30 ' + currentVolume.value + '%, #2d2d30 100%)';
}

function songInit(aSongRow) {
    getSongInfos(aSongRow.getAttribute('data-picture'), aSongRow.getAttribute('data-title'), aSongRow.getAttribute('data-artist'));
    startSong(aSongRow.getAttribute('data-path'));  
}

function addToFavorite(songRow) {
    if (songRow.getAttribute('data-favorite') == '0') {
        songRow.querySelector('a.fav-btn i').classList.replace('far', 'fas');
        songRow.setAttribute('data-favorite', '1');
    }
    else {
        songRow.querySelector('a.fav-btn i').classList.replace('fas', 'far');
        songRow.setAttribute('data-favorite', '0');
    }
    $.ajax({
        type: "POST",
        url: '/addFavorite',
        data: { songId: songRow.getAttribute('data-id') },
    })

}

function dragStart() {
    this.className += ' tenu';
    draggedRow = this;
    setTimeout(() => (this.className = 'invisible'), 0);
}

function dragEnd() {
    this.classList.remove('tenu');
}


function dragOver(e) {
    e.preventDefault()
}

function dragEnter(e) {
    e.preventDefault();
    this.classList.add('hovered');
}

function dragLeave() {
    this.classList.remove('hovered');
}


function dragDrop() {
    $.ajax({
        type: 'POST',
        url: '/addToPlaylist',
        data: { playlistId: this.getAttribute('data-playlist-id'), songId: draggedRow.getAttribute('data-id') },
        beforeSend: function () {
            preloader.style.display = 'block';
        },
        complete: function () {
            preloader.style.display = 'none';
        }
    })
}