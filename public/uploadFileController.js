const songForm = document.getElementById('upload-song-form');
const songInput = document.getElementById('import_song');
const submitBtn = document.getElementById('upload-song-submit');

const validateForm = () => {
    const songsFiles = songInput.files;
    const exceptedSongFiles = ['mp3', 'wav', 'aac'];
    if (songsFiles.length == 0) {
        console.log('Cannot be empty');
        return false;
    }
    for (let i = 0; i < songsFiles.length; i++) {
        const extension = songsFiles[i].name.split('.').pop();
        if (!exceptedSongFiles.includes(extension)) {
            console.log('Please use mp, wav or aac files');
            return false;
        }
    }
    return true;
};

const postData = async (data) => {
    const result = await fetch('/upload', {
        method: 'POST',
        body: data,
    });
    if (result.ok) {
        console.log('Fetch success');
        const resp = await result.json();
        if (resp.success) {
            console.log('fetch to json success');
        }
        if (!resp.success) {
            console.log('error in json translation');
        }
    }
};

songForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    const valid = validateForm();
    if (valid) {
        console.log('Files are valid');
        const fData = new FormData(songForm);
        await postData(fData);
    }
});

songInput.addEventListener('change', function () {
    if (songInput.files.length == 0) {
        submitBtn.style.transform = 'scaleX(0)';
        submitBtn.style.opacity = '0';
    }
    else if (songInput.files.length !== 0) {
        submitBtn.style.transform = 'scaleX(1)';
        submitBtn.style.opacity = '1'; 
    }
});

