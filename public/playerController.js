var randomize = document.getElementById('randomize-checkbox');
var randomizeLabel = document.getElementById('randomize-label');
var songTable = document.getElementById('songList');
var loop = document.getElementById('loop-checkbox');
var loopLabel = document.getElementById('loop-label');
var looperActiveStateVisual = document.getElementById('looperActiveStateVisual');
var randomizeActiveStateVisual = document.getElementById('randomizeActiveStateVisual');
var stepBackwark = document.getElementById('step-backward');
var stepForward = document.getElementById('step-forward');
randomizeActiveStateVisual.style.display = 'none';
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

function randomizer() {
    if (randomize.checked) {
        var counter = random(0, songRow.length + 1);
        activeSong = counter;
        songInit(songRow[counter]);
    }
}

stepBackwark.addEventListener('click', function() {
    if (randomize.checked) {
        randomizer();
    }
    else {
        if (activeSong == 0) {
            activeSong = songRow.length;
            songInit(songRow[songRow.length-1]);
        }
        else {
            songInit(songRow[activeSong - 1]);
            activeSong--;
        }
    }
});

stepForward.addEventListener('click', function() {
    if (randomize.checked) {
        randomizer();
    }
    else {
        if (activeSong == songRow.length) {
            activeSong = 0;
            songInit(songRow[0]);
        }
        else {
            songInit(songRow[activeSong + 1]);
            activeSong++;
        }
    }
});


loop.addEventListener('change', function () {
    looper();
})

randomize.addEventListener('change', function () {
    if (randomize.checked) {
        randomizeActiveStateVisual.style.display = 'block';
    }
    else if (!randomize.checked) {
        randomizeActiveStateVisual.style.display = 'none';
    }
})

function looper() {
    if (loop.checked) {
        player.loop = true;
        looperActiveStateVisual.style.display = 'block';
    }
    else if (!loop.checked) {
        player.loop = false;
        looperActiveStateVisual.style.display = 'none';
    }
}

player.addEventListener('ended', function () {
    if (!player.loop) {
        randomizer();
    }
});
