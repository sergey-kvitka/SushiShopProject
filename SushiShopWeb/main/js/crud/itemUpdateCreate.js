logOutIfNoRole('ROLE_ADMIN').then();

header();
fillHeader().then();

let isUpdating;

let inputName = document.getElementById('item-input-name');
let inputPrice = document.getElementById('item-input-price');
let inputDescription = document.getElementById('item-input-description');
let inputAmount = document.getElementById('food-input-amount');
let inputCalories = document.getElementById('food-input-calor');
let inputWeight = document.getElementById('food-input-weight');

let params = new URLSearchParams(window.location.search);

let mode = params.get('mode');
let itemId = +params.get('id');
console.log(`${mode}${itemId}`);

if (mode != null && mode.toLowerCase() === 'create') {
    console.log('e1');
    isUpdating = false;
    main_();
} else if (mode == null || itemId == null) {
    console.log('e2');
    const newUrl = new URL(location.href);
    newUrl.searchParams.append('mode', 'create');
    window.history.replaceState({}, document.title, newUrl.href);
    isUpdating = false;
    main_();
} else {
    if (mode.toLowerCase() === 'update') {
        console.log('e3');
        isUpdating = true;
        main_();
    } else {
        const newUrl = new URL(location.href);
        newUrl.searchParams.append('mode', 'create');
        window.history.replaceState({}, document.title, newUrl.href);
        isUpdating = false;
        main_();
    }
}

async function doIfUpdating() {
    const response = await fetch(getUrl(Endpoints.GET_ITEM_BY_ID)
        + '?' + new URLSearchParams({id: '' + itemId}));
    response.json().then(item => {
        console.log(item);
        itemToUpdate = item;
        inputName.value = item['item']['name'];
        inputPrice.value = item['item']['price'];
        inputDescription.value = item['item']['description'];
        if (item['item']['category']['hyperCategory'].toLowerCase() === 'food') {
            inputAmount.value = item['amount'];
            inputCalories.value = item['calories'];
            inputWeight.value = item['weight'];
        }
        main();
    }).catch(error => {
        console.log('handled: ' + error.message);
        const newUrl = new URL(location.href);
        newUrl.searchParams.delete('mode');
        newUrl.searchParams.delete('id');
        newUrl.searchParams.append('mode', 'create');
        window.history.replaceState({}, document.title, newUrl.href);
        isUpdating = false;
        main();
    });
}

const FOOD_CATEGORIES = [];
const OTHER_CATEGORIES = [];

const INGREDIENTS = [];

let itemToUpdate;

function main_() {
    getCategories().then(categories => {
        let length = categories.length;
        for (let i = 0; i < length; i++) {
            let category = categories[i];
            if (category['hyperCategory'].toLowerCase() === 'food') FOOD_CATEGORIES.push(category);
            if (category['hyperCategory'].toLowerCase() === 'other') OTHER_CATEGORIES.push(category);
        }
        getIngredients().then(ingredients => {
            let length = ingredients.length;
            for (let i = 0; i < length; i++) {
                INGREDIENTS.push(ingredients[i]);
            }
            if (isUpdating) {
                doIfUpdating().then();
            } else main();
        })
    });
}

function main() {
    const HEADER_OPTIONS = ['Добавление нового товара', 'Изменение товара']

    const DOC_TITLE = document.getElementById('update-create-title');

    const FORM_HEADER = document.getElementById('save-item-header-text');

    let option;

    const ITEM_TYPES = ['Еда', 'Прочие товары']

    let categoryList = document.getElementById('category-list');

    let selectTypeFood = document.getElementById('choose-type-food');
    let selectTypeExtra = document.getElementById('choose-type-extra');

    let allTypeSelects = [selectTypeFood, selectTypeExtra];

    allTypeSelects.forEach(selectType => selectType.addEventListener('click', () => {
        setCategoriesByType(selectType);
    }));

    let foodPropertiesForm = document.getElementById('food-properties-forms');

    let submit = document.getElementById('update-create-submit');

    let submitText = ['Создать товар', 'Сохранить изменения']

    let foodInputForms = document.getElementsByClassName('food-property-input');
    let foodInputFormRequired = [true, false]

    if (isUpdating) { //isUpdating
        option = 1;
        let hyperCategory = itemToUpdate['item']['category']['hyperCategory'].toLowerCase();
        setCategoriesByType(allTypeSelects[hyperCategory === 'food' ? 0 : 1], true);
        if (hyperCategory === 'food') {
            addIngredientList(document.getElementById('choose-ingredients'));
        }
    } else { //isCreating
        option = 0;
        setCategoriesByType(allTypeSelects[0]);
        addIngredientList(document.getElementById('choose-ingredients'));
    }

    DOC_TITLE.innerText = HEADER_OPTIONS[option];
    FORM_HEADER.innerText = HEADER_OPTIONS[option];
    submit.innerText = submitText[option];

    function setCategoriesByType(selectTypeButton, hideButtons = false) {
        let type = selectTypeButton.innerText;
        categoryList.innerHTML = '';
        let categories;
        let foodFormDisplay;
        let indexOfItemType = ITEM_TYPES.indexOf(type);
        if (indexOfItemType === 0) {
            categories = FOOD_CATEGORIES;
            foodFormDisplay = 'flex';
        }
        if (indexOfItemType === 1) {
            categories = OTHER_CATEGORIES;
            foodFormDisplay = 'none';
        }
        for (let i = 0; i < foodInputForms.length; i++) {
            foodInputForms.item(i).required = foodInputFormRequired[indexOfItemType];
        }
        foodPropertiesForm.setAttribute('style', `display: ${foodFormDisplay};`);
        categories.forEach(category => addCategory(category, categoryList));
        allTypeSelects.forEach(button => {
            if (button === selectTypeButton) button.classList.add('selected-type-button');
            else button.classList.remove('selected-type-button');
        });
        if (hideButtons) {
            document.getElementById('choosing-item-type').style = 'display: none;';
        }
    }

    function addCategory(category, listElement) {
        let categoryOption = document.createElement('option');
        let categoryName = category['name'].toLowerCase();
        categoryOption.setAttribute('value', categoryName);
        categoryOption.innerHTML = capitalize(categoryName);
        if (isUpdating && (itemToUpdate['item']['category']['name'].toLowerCase() === categoryName)) {
            categoryOption.selected = true;
        }
        listElement.appendChild(categoryOption);
    }

    function addIngredientList(container) {
        INGREDIENTS.forEach(ingredient => {
            let option = document.createElement('div');
            let label = document.createElement('label');
            label.classList.add('ingredient-option');
            label.innerText = capitalize(ingredient['name']);
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style = 'cursor: pointer';
            checkbox.classList.add('create-item-ingred-checkbox');
            checkbox.value = ingredient['name'];
            option.appendChild(label);
            label.appendChild(checkbox);
            if (isUpdating) {
                let curIngredient = itemToUpdate['ingredients'];
                let length = curIngredient.length;
                for (let i = 0; i < length; i++) {
                    if (curIngredient[i]['name'].toLowerCase() === ingredient['name'].toLowerCase()) {
                        checkbox.checked = true;
                    }
                }
            }
            container.appendChild(option);
        });


    }
console.log(Date.parse(new Date().toLocaleDateString()) + new Date().getMilliseconds())
    let ingredients;

    let objectURL;
    let inputImage = document.getElementById('item-input-image');
    let link = document.getElementById('download-img-link');

    submit.addEventListener('click', async function () {

        logOutIfNoRole('ROLE_ADMIN').then(async _ => {
            ingredients = document.getElementsByClassName('create-item-ingred-checkbox');
            let finalIngredients = [];
            for (let i = 0; i < ingredients.length; i++) {
                let name = ingredients.item(i).value;
                let checked = ingredients.item(i).checked;
                INGREDIENTS.forEach(ingr => {
                    if (checked && ingr['name'].toLowerCase() === name.toLowerCase()) {
                        finalIngredients.push(ingr);
                    }
                });
            }
            let category = categoryList.value;
            let isFood = inputCalories.required;
            if (isFood) {
                let isChosen = false;
                FOOD_CATEGORIES.forEach(cat => {
                    if (!isChosen && cat['name'].toLowerCase() === category.toLowerCase()) {
                        category = cat;
                        isChosen = true;
                    }
                });
            } else {
                let isChosen = false;
                OTHER_CATEGORIES.forEach(cat => {
                    if (!isChosen && cat['name'].toLowerCase() === category.toLowerCase()) {
                        category = cat;
                        isChosen = true;
                    }
                });
            }
            let name = inputName.value.trim().toLowerCase();
            let price = Math.round((+inputPrice.value) * 100) / 100;
            let updateCreateDto = {
                "item": {
                    "name": name,
                    "price": price,
                    "description": inputDescription.value.trim(),
                    "imagePath": '',
                    "category": category
                }
            };
            if (isUpdating) {
                updateCreateDto['id'] = itemToUpdate['id'];
                updateCreateDto['item']['id'] = itemToUpdate['id'];
            }
            let isOk = true;
            if (isFood) {
                updateCreateDto['ingredients'] = finalIngredients;
                let amount = +inputAmount.value;
                let calories = +inputCalories.value;
                let weight = +inputWeight.value;
                updateCreateDto['amount'] = amount;
                updateCreateDto['calories'] = calories;
                updateCreateDto['weight'] = weight;
                let errorAmount = document.getElementById('food-input-amount-error');
                if (amount <= 0 || amount % 1 !== 0 || amount >= 10000) {
                    errorAmount.innerText = 'Неверный формат (количество должно быть целым числом больше 0 и меньше 10000).';
                    isOk = false;
                } else errorAmount.innerText = '';
                let errorCalories = document.getElementById('food-input-calor-error');
                if (calories <= 0 || calories % 1 !== 0 || calories >= 10000) {
                    errorCalories.innerText = 'Неверный формат (калории должны должны быть целым числом больше 0 и меньше 10000).';
                    isOk = false;
                } else errorCalories.innerText = '';
                let errorWeight = document.getElementById('food-input-weight-error');
                if (weight <= 0 || weight % 1 !== 0 || weight >= 10000) {
                    errorWeight.innerText = 'Неверный формат (вес должен быть целым числом больше 0 и меньше 10000).';
                    isOk = false;
                } else errorWeight.innerText = '';
            }
            let errorName = document.getElementById('item-input-name-error');
            name = name.replace(/ё/gm, 'е').replace(/Ё/gm, 'Е');
            if (!(/[а-яА-Яa-zA-Z](.{0,1000})[а-яА-Яa-zA-Z](.{0,1000})[а-яА-Яa-zA-Z]/.test(name))
                || !(/^[a-zA-Zа-яА-Я0-9 ,()]+$/.test(name))) {
                errorName.innerText = 'Неверный формат названия (должно быть хотя бы 3 буквы, и ' +
                    'допустимы только цифры, пробелы, запятые и скобки).';
                isOk = false;``
            } else if (name.length > 30) {
                errorName.innerText = 'Длина названия не должна превышать 30 символов.';
                isOk = false;
            } else errorName.innerText = '';
            let errorPrice = document.getElementById('item-input-price-error');
            if (price <= 0 || price >= 10000) {
                errorPrice.innerText = 'Неверный формат (цена должна быть числом больше 0 и меньше 10000).';
                isOk = false;
            } else errorPrice.innerText = '';

            console.log(updateCreateDto);
            if (!isOk) {
                return;
            }


            try {
                let extension = '';
                let data = inputImage.files[0].name.split('.');
                console.log(data[data.length - 1]);
                extension = data[data.length - 1];
                let filePath = `${IMG_NAME_BEGINNING}${
                    (Date.parse(new Date().toLocaleDateString()) + new Date().getMilliseconds())}.${extension}`;

                updateCreateDto['item']['imagePath'] = filePath;

                if (objectURL) {
                    URL.revokeObjectURL(objectURL);
                }
                const file = inputImage.files[0];
                objectURL = URL.createObjectURL(file);

                link.download = filePath; // this name is used when the user downloads the file
                link.href = objectURL;

                link.click();
            } catch (e) {
                console.log(e);
            }

            let endpoint = isFood ? Endpoints.SAVE_FOOD : Endpoints.SAVE_EXTRA_ITEM;
            const response = (await fetch(getUrl(endpoint), {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateCreateDto)
            })).json();
            response.then(res => {
                if (res === true) {
                    alert(isUpdating ? 'Изменения сохранены' : 'Товар успешно создан');
                } else errorName.innerText = 'Товар с таким названием уже существует.';
            });
        });
    });
}

