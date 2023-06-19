logOutIfNoRole('ROLE_ADMIN').then();

header();
fillHeader().then();

let ingredients = [];

let ingredientCont;

function loadIngredients() {
    getIngredients().then(ingrs => {
        ingredients = ingrs;
        main();
    });
}

async function getIngredients() {
    return (await fetch(getUrl(Endpoints.GET_INGREDIENTS))).json();
}

loadIngredients();

function main() {
    ingredientCont = document.getElementById('crud-ingredient-list');
    ingredientCont.innerHTML = '';

    ingredients.forEach(ingredient => {
        ingredientCont.appendChild(getIngredientElem(ingredient));
    });
}

document.getElementById('create-ingr-btn').addEventListener('click',  async () => {
    logOutIfNoRole('ROLE_ADMIN').then(async y => {
    });
    let ingrNameInput = document.getElementById('new-ingr-name');
    let ingrDescInput = document.getElementById('new-ingr-desc');

    let name = ingrNameInput.value.trim();
    let nameToCheck = name.replace(/ё/gm, 'е').replace(/Ё/gm, 'Е');
    if (name.length < 2 || name.length > 25 || !(/^[а-яА-Яa-zA-Z ]+$/.test(nameToCheck))) {
        notify('Название ингредиента должно состоять только из букв и пробелов' +
            ' и быть размером от 2 до 25 символов.');
        return;
    }
    let description = ingrDescInput.value.trim();
    if (description.length > 60) {
        notify('Описание ингредиента не должно превышать 60 символов.');
        return;
    }

    await fetch(getUrl(Endpoints.SAVE_INGREDIENT), {
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify({
            'id': null,
            'name': name,
            'description': description
        })
    }).then(r => {
        if (r.status === 500) {
            notify('Ингредиент с таким названием уже существует');
            return;
        }
        notify('Ингредиент создан');
        loadIngredients();
    }).catch(e => {
    });

});

function getIngredientElem(ingredient) {
    let ingredientElem = document.createElement('div');
    ingredientElem.classList.add('ingredient-elem');

    let ingredientName = document.createElement('input');
    ingredientName.type = 'text';
    ingredientName.placeholder = 'Название ингредиента';
    ingredientName.value = ingredient['name'];

    let ingredientDescription = document.createElement('textarea');
    ingredientDescription.value = ingredient['description'];
    ingredientDescription.placeholder = 'Описание (необязательное поле)';

    let saveBtn = document.createElement('div');
    saveBtn.innerText = '✅';
    saveBtn.style = 'color: #1ab51e; font-size: 32px; cursor: pointer';
    saveBtn.title = 'Сохранить изменения';
    saveBtn.addEventListener('click', async () => {
        logOutIfNoRole('ROLE_ADMIN').then(async y => {
        let name = ingredientName.value.trim();
        let nameToCheck = name.replace(/ё/gm, 'е').replace(/Ё/gm, 'Е');
        if (name.length < 2 || name.length > 25 || !(/^[а-яА-Яa-zA-Z ]+$/.test(nameToCheck))) {
            notify('Название ингредиента должно состоять только из букв и пробелов' +
                ' и быть размером от 2 до 25 символов.');
            return;
        }
        let description = ingredientDescription.value.trim();
        if (description.length > 60) {
            notify('Описание ингредиента не должно превышать 60 символов.');
            return;
        }

        await fetch(getUrl(Endpoints.SAVE_INGREDIENT), {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({
                'id': ingredient['id'],
                'name': name,
                'description': description
            })
        }).then(_ => {
            notify('Изменения сохранены');
        });
        });
    });

    let deleteBtn = document.createElement('div');
    deleteBtn.innerText = '❌';
    deleteBtn.style = 'color: red; font-size: 32px; cursor: pointer';
    deleteBtn.title = 'Удалить ингредиент';
    deleteBtn.addEventListener('click', async () => {
        logOutIfNoRole('ROLE_ADMIN').then(y => {
            let isDeleting = confirm(`Удалить ингредиент "${ingredient['name']}"?`);
            if (!isDeleting) return;
            fetch(getUrl(Endpoints.DELETE_INGREDIENT + '/' + ingredient['id']), {
                method: 'DELETE', headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
            }).then(u => {
                notify('Ингредиент ' + ingredient['name'] + ' удалён');
                loadIngredients();
            });
        });

    });

    ingredientElem.appendChild(ingredientName);
    ingredientElem.appendChild(ingredientDescription);
    ingredientElem.appendChild(saveBtn);
    ingredientElem.appendChild(deleteBtn);

    return ingredientElem;
}