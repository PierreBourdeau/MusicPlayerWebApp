var submitter = document.getElementById('submitter');

var ppInput = document.getElementById('userPpInput');

var userName = document.getElementById('username');
var surname = document.getElementById('usersurname');

var email = document.getElementById('usermail');
var emailConfirmation = document.getElementById('usermailconfirmation');

var password = document.getElementById('userpassword');
var passwordConfirmation = document.getElementById('userpasswordconfirmation');

var registerForm = document.getElementById('register-form');


var allInputs = [userName, surname, email, emailConfirmation, password, passwordConfirmation];
for (let i = 0; i < allInputs.length; i++) {
    allInputs[i].addEventListener('keyup', function () {
        validateRegisterForm();
    });
}

function ppFormVerify(file) {
    let res = false;
    const exceptedSongFiles = ['jpg', 'png', 'jpeg'];
    if (exceptedSongFiles.includes(file.split('.').pop())) {
        res = true;
    }
    return res;
}


function validateRegisterForm() {
    let emailValidity, passwordValidity, idValidity, ppValidity = false;
    let res = false;
    if (email.value.length > 0 || emailConfirmation.value.length > 0) {
        if (email.checkValidity()) {
            email.classList.remove('input-error');
            if (email.value == emailConfirmation.value) {
                emailConfirmation.classList.remove('input-error');
                emailValidity = true;
            }
            else {
                emailConfirmation.classList.add('input-error');
            }
        }
        else if (!email.checkValidity()) {
            email.classList.add('input-error');
        }
    }
    else if (email.value.length == 0 && emailConfirmation.value.length == 0) {
        emailConfirmation.classList.remove('input-error');
    }
    if (password.value.length > 0 || passwordConfirmation.value.length > 0) {
        if (password.value == passwordConfirmation.value) {
            passwordConfirmation.classList.remove('input-error');
            passwordValidity = true;
        }
        else if (password.value !== passwordConfirmation.value) {
            passwordConfirmation.classList.add('input-error');
        }
    }
    else if (password.value.length == 0 && passwordConfirmation.value.length == 0) {
        passwordConfirmation.classList.remove('input-error');
    }
    if (!/\d/g.test(userName.value) && !/\d/g.test(surname.value) && userName.value.length > 0 && surname.value.length > 0) {
        idValidity = true;
    }
    if (!/\d/g.test(userName.value)) {
        userName.classList.remove('input-error');
    }
    if (!/\d/g.test(surname.value)) {
        surname.classList.remove('input-error');
    }
    if (/\d/g.test(userName.value)) {
        userName.classList.add('input-error');
    }
    if (/\d/g.test(surname.value)) {
        surname.classList.add('input-error');
    }

    if (ppInput.files.length == 0) {
        ppValidity = true;
    }
    if (ppInput.files.length > 0) {
        if (ppFormVerify(ppInput.value)) {
            ppValidity = true;
        }
    }

    if (emailValidity && passwordValidity && idValidity && ppValidity) {
        res = true;
    }
    return res;
}
/*
const sendCredentials = async (data) => {
    const result = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ credentials: data }),
    });
    /*if (result.ok) {
        const resp = await result.text();
        if (resp.status == 1) {
            window.location.replace('/login');
        }
        if (resp.status == 0) {
            console.log('error in json translation');
        }
    }
};
*/
/*
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const valid = validateRegisterForm();
    if (valid) {
        if (ppInput.files.length > 0) {
            const fData = { 'email': email.value, 'password': password.value, 'name': userName.value, 'surname': surname.value, 'profilePicture': '/profilePicture/'+ppInput.files[0].name };
            await sendCredentials(fData);
        }
        else {
            const fData = { 'email': email.value, 'password': password.value, 'name': userName.value, 'surname': surname.value, 'profilePicture': 'unknown_cover.jpg' };
            await sendCredentials(fData);
        }
    }
});*/

submitter.addEventListener('click', function () {
    if (validateRegisterForm()) {
        registerForm.submit();
    }
});