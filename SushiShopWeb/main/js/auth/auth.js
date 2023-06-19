

function register() {
    clearLSAuthData();

    header();
    fillHeader().then();

    let registrationButton = document.getElementById('register-button');
    let firstNameInput = document.getElementById('firstName-reg-input');
    let lastNameInput = document.getElementById('lastName-reg-input');
    let usernameInput = document.getElementById('username-reg-input');
    let passwordInput = document.getElementById('password-reg-input');
    let checkPassInput = document.getElementById('check-pass-reg-input');
    let firstNameError = document.getElementById('firstName-reg-error');
    let lastNameError = document.getElementById('lastName-reg-error');
    let usernameError = document.getElementById('username-reg-error');
    let passwordError = document.getElementById('password-reg-error');
    let checkPassError = document.getElementById('check-pass-reg-error');

    registrationButton.addEventListener('click', () => {
        register(firstNameInput.value.trim(), lastNameInput.value.trim(),
            usernameInput.value.trim(), passwordInput.value, checkPassInput.value).then();
    });

    async function register(firstName, lastName, username, password, checkPass) {
        while (firstName.includes('  ')) firstName = firstName.replace('  ', ' ');
        while (lastName.includes('  ')) lastName = lastName.replace('  ', ' ');

        let firstName_ = firstName;
        let lastName_ = lastName;

        let firstNameMessage = [];
        firstName = firstName.replace(/ё/gm, 'е').replace(/Ё/gm, 'Е');
        if (firstName === '') {
            firstNameMessage.push('Данное поле не должно быть пустым');
        } else {
            if (firstName.length > 30)
                firstNameMessage.push('Имя должно состоять из не более чем 30 символов');
            if (!HAS_TWO_LETTERS_REGEX.test(firstName))
                firstNameMessage.push('Имя должно состоять из хотя бы 2 букв');
            if (!NAME_REGEX.test(firstName))
                firstNameMessage.push('Имя может состоять только из букв, дефисов, апострофов и пробелов');
        }
        firstNameError.innerText = firstNameMessage.join('\n');

        let lastNameMessage = [];
        lastName = lastName.replace(/ё/gm, 'е').replace(/Ё/gm, 'Е');
        if (lastName === '') {
            lastNameMessage.push('Данное поле не должно быть пустым');
        } else {
            if (lastName.length > 30)
                firstNameMessage.push('Фамилия должна состоять из не более чем 30 символов');
            if (!HAS_TWO_LETTERS_REGEX.test(lastName))
                lastNameMessage.push('Фамилия должна состоять из хотя бы 2 букв');
            if (!NAME_REGEX.test(lastName))
                lastNameMessage.push('Фамилия может состоять только из букв, дефисов, апострофов и пробелов');
        }
        lastNameError.innerText = lastNameMessage.join('\n');

        let usernameMessage = [];
        if (username === '') {
            usernameMessage.push('Данное поле не должно быть пустым');
        } else {
            if (username.length < 3)
                usernameMessage.push('Логин должен состоять из хотя бы 3 символов');
            if (username.length > 30)
                firstNameMessage.push('Логин должен состоять из не более чем 30 символов');
            if (!USERNAME_REGEX.test(username))
                usernameMessage.push('Логин должен состоять только из латинских букв, цифр, дефисов, точек и ' +
                    'знаков нижнего подчёркивания.');
            if (!HAS_LATIN_LETTER_REGEX.test(username[0]))
                usernameMessage.push('Логин должен начинаться с латинской буквы');
        }
        usernameError.innerText = usernameMessage.join('\n');

        let passwordMessage = []
        if (password === '') {
            passwordMessage.push('Данное поле не должно быть пустым')
        } else if (password.length < 4 || password.length > 60)
            passwordMessage.push('Пароль должен состоять из хотя бы 4 символов и быть не длиннее 60 символов')
        passwordError.innerText = passwordMessage.join('\n');

        let checkPasswordMessage = []
        if (checkPass === '') {
            checkPasswordMessage.push('Данное поле не должно быть пустым')
        } else if (checkPass !== password)
            checkPasswordMessage.push('Пароли должны совпадать');
        checkPassError.innerText = checkPasswordMessage.join('\n')

        console.log('проверка...');
        if (firstNameMessage.length !== 0 || lastNameMessage.length !== 0 || usernameMessage.length !== 0
            || passwordMessage.length !== 0 || checkPasswordMessage.length !== 0) {
            console.log('проверка не пройдена');
            return;
        }
        console.log('проверка пройдена');
        const response = (await fetch(getUrl(Endpoints.REG_ENDPOINT), {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({
                "firstName": firstName_, "lastName": lastName_,
                "username": username, "password": password
            })
        })).json();
        response.then(result => {
            let username = result.username;
            if (username === undefined) {
                usernameError.innerText = 'Такое имя пользователя уже занято';
                return;
            }
            console.log(result);
            setUsername(username);
            setToken(result['token']);
            setUserId(result['userId']);
            setFirstName(result['firstName']);
            setLastName(result['lastName']);
            window.location.href = 'catalog.html?success=reg';
        });
    }
}

function login() {
    clearLSAuthData();
    header();

    fillHeader().then();


    let loginButton = document.getElementById('login-button');
    let usernameInput = document.getElementById('username-login-input');
    let passwordInput = document.getElementById('password-login-input');
    let usernameError = document.getElementById('username-login-error');
    let passwordError = document.getElementById('password-login-error');

    loginButton.addEventListener('click', () => {
       login(usernameInput.value.trim(), passwordInput.value).then();
    });

    async function login(username, password) {
        let isOk = true;
        if (username === '') {
            usernameError.innerText = 'Данное поле не должно быть пустым';
            isOk = false;
        } else usernameError.innerText = '';
        if (password === '') {
            passwordError.innerText = 'Данное поле не должно быть пустым';
            isOk = false;
        } else passwordError.innerText = '';
        if (!isOk) return;
        const response = (await fetch(getUrl(Endpoints.LOGIN_ENDPOINT), {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({"username": username, "password": password})
        })).json();
        response.then(result => {
            let username = result.username;
            if (username === undefined) {
                usernameError.innerText = 'Неверный логин или пароль';
                return;
            }
            console.log(result);
            setUsername(username);
            setToken(result['token']);
            setUserId(result['userId']);
            setFirstName(result['firstName']);
            setLastName(result['lastName']);
            window.location.href = 'catalog.html?success=auth';
        });
    }
}