let isUpdating = false;

const HEADER_OPTIONS = ['Добавление нового товара', 'Изменение товара']

const DOC_TITLE = document.getElementById('update-create-title');

const FORM_HEADER = document.getElementById('save-item-header-text');

let option;

const ITEM_TYPES = ['Еда', 'Прочие товары']

let categoryList = document.getElementById('category-list');

let selectTypeFood = document.getElementById('choose-type-food');
let selectTypeExtra = document.getElementById('choose-type-extra');

allTypeSelects = [selectTypeFood, selectTypeExtra];

allTypeSelects.forEach(selectType =>
    selectType.addEventListener('click', () => setCategoriesByType(selectType)));

let foodPropertiesForm = document.getElementById('food-properties-forms');

let submit = document.getElementById('update-create-submit');

let submitText = ['Создать товар', 'Сохранить изменения']

let foodInputForms = document.getElementsByClassName('food-property-input');
let foodInputFormRequired = [true, false]

if (isUpdating) { //isUpdating
    option = 1;
}
else { //isCreating
    option = 0;
    setCategoriesByType(allTypeSelects[0]);
}
DOC_TITLE.innerText = HEADER_OPTIONS[option];
FORM_HEADER.innerText = HEADER_OPTIONS[option];
submit.innerText = submitText[option];

function setCategoriesByType(selectTypeButton) {
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
        else button.classList.remove('selected-type-button')
    })
}

function addCategory(category, listElement) {
    let categoryOption = document.createElement('option');
    categoryOption.setAttribute('value', category);
    categoryOption.innerHTML = capitalize(category);
    listElement.appendChild(categoryOption);
}

