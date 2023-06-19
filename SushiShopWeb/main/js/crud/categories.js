logOutIfNoRole('ROLE_ADMIN').then();

header();
fillHeader().then();

let categories = [];

let categoryCont;

function loadCategories() {
    getCategories().then(cat => {
        categories = cat;
        main();
    });
}

async function getCategories() {
    return (await fetch(getUrl(Endpoints.GET_CATEGORIES))).json();
}

loadCategories();

function main() {
    categoryCont = document.getElementById('crud-category-list');
    categoryCont.innerHTML = '';

    categories.forEach(category => {
        categoryCont.appendChild(getCategoryElem(category));
    });
}

document.getElementById('create-category-btn').addEventListener('click',  async () => {
    logOutIfNoRole('ROLE_ADMIN').then(async y => {
    });
    let categoryNameInput = document.getElementById('new-category-name');

    let name = categoryNameInput.value.trim();
    let nameToCheck = name.replace(/ё/gm, 'е').replace(/Ё/gm, 'Е');
    if (name.length < 3 || name.length > 30 || !(/^[а-яА-Яa-zA-Z ]+$/.test(nameToCheck))) {
        notify('Название категории должно состоять только из букв и пробелов' +
            ' и быть размером от 3 до 30 символов.');
        return;
    }

    await fetch(getUrl(Endpoints.SAVE_CATEGORY), {
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify({
            'id': null,
            'name': name,
            'hyperCategory': document.querySelector(`input[name="category-new"]:checked`).value
        })
    }).then(r => {
        if (r.status === 500) {
            notify('Категория с таким названием уже существует');
            return;
        }
        notify('Категория создана');
        loadCategories();
    }).catch(e => {
    });

});

function getCategoryElem(category) {
    let categoryElem = document.createElement('div');
    categoryElem.classList.add('category-elem');

    let categoryName = document.createElement('input');
    categoryName.type = 'text';
    categoryName.placeholder = 'Название категории';
    categoryName.value = category['name'];

    let hyperCategoryChoose = document.createElement('div');
    let hyperFood = document.createElement('input');
    hyperFood.type = 'radio';
    let rbName = 'category-' + category['id'];
    hyperFood.name = rbName;
    hyperFood.value = 'food';
    hyperFood.checked = true;

    let hyperOther = document.createElement('input');
    hyperOther.type = 'radio';
    hyperOther.name = rbName;
    hyperOther.value = 'other';

    let hyperFoodL = document.createElement('label');
    hyperFoodL.innerText = 'Еда';
    hyperFoodL.appendChild(hyperFood);

    let hyperOtherL = document.createElement('label');
    hyperOtherL.innerText = 'Прочие товары';
    hyperOtherL.appendChild(hyperOther);

    hyperCategoryChoose.appendChild(hyperFoodL);
    hyperCategoryChoose.appendChild(hyperOtherL);



    let saveBtn = document.createElement('div');
    saveBtn.innerText = '✅';
    saveBtn.style = 'color: #1ab51e; font-size: 32px; cursor: pointer';
    saveBtn.title = 'Сохранить изменения';
    saveBtn.addEventListener('click', async () => {
        logOutIfNoRole('ROLE_ADMIN').then(async y => {
            let name = categoryName.value.trim();
            let nameToCheck = name.replace(/ё/gm, 'е').replace(/Ё/gm, 'Е');
            if (name.length < 3 || name.length > 30 || !(/^[а-яА-Яa-zA-Z ]+$/.test(nameToCheck))) {
                notify('Название категории должно состоять только из букв и пробелов' +
                    ' и быть размером от 3 до 30 символов.');
                return;
            }

            await fetch(getUrl(Endpoints.SAVE_CATEGORY), {
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'id': category['id'],
                    'name': name,
                    'hyperCategory': document.querySelector(`input[name=${rbName}]:checked`).value
                })
            }).then(_ => {
                notify('Изменения сохранены');
            });
        });
    });

    let deleteBtn = document.createElement('div');
    deleteBtn.innerText = '❌';
    deleteBtn.style = 'color: red; font-size: 32px; cursor: pointer';
    deleteBtn.title = 'Удалить категорию';
    deleteBtn.addEventListener('click', async () => {
        logOutIfNoRole('ROLE_ADMIN').then(y => {
            let isDeleting = confirm(`Внимание! Все товары данной категории будут удалены вместе с ней.` +
                `\nУдалить категорию "${category['name']}"?`);
            if (!isDeleting) return;
            fetch(getUrl(Endpoints.DELETE_CATEGORY + '/' + category['id']), {
                method: 'DELETE', headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
            }).then(u => {
                notify('Категория ' + category['name'] + ' удалена');
                loadCategories();
            });
        });

    });

    categoryElem.appendChild(categoryName);
    categoryElem.appendChild(hyperCategoryChoose);
    categoryElem.appendChild(saveBtn);
    categoryElem.appendChild(deleteBtn);

    return categoryElem;
}