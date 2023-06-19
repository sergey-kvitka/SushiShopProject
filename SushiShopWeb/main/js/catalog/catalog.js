header();
fillHeader().then();

let itemsContainer = document.getElementById(ITEM_CATALOG_CONTAINER);

let itemsHeader = document.getElementById(ITEM_CATALOG_HEADER);

let categoriesPanel = document.getElementById('categories-panel-cont');

let params = new URLSearchParams(window.location.search);

async function getAllItemsFromApi() {
    const response = await fetch(getUrl(Endpoints.GET_CATALOG_ITEMS));
    return await response.json();
}

const FOOD_CATEGORIES = [];
const OTHER_CATEGORIES = [];

async function showCatalog(category) {
    getCategories().then(categories => {
        if (FOOD_CATEGORIES.length === 0) {
            let amount = categories.length;
            for (let i = 0; i < amount; i++) {
                let category = categories[i];
                if (category['hyperCategory'].toLowerCase() === 'food') FOOD_CATEGORIES.push(category['name']);
                if (category['hyperCategory'].toLowerCase() === 'other') OTHER_CATEGORIES.push(category['name']);
            }
            createCategoryButtons(categoriesPanel);
        }
        getAllItemsFromApi().then(items => {
            console.log(items);
            if (category != null) items = items.filter(item => {
                return item.item.category.name === category;
            });
            else {
                let newItems = [];
                let categories = FOOD_CATEGORIES.concat(OTHER_CATEGORIES);
                let length = items.length;
                categories.forEach(category => {
                    for (let i = 0; i < length; i++) {
                        if (items[i].item.category.name === category) {
                            newItems.push(items[i]);
                        }
                    }
                });
                items = newItems;
            }
            showItems(items, itemsContainer);
        });
    });
}

let tileAndItems = [];

function showItems(items, container) {
    container.innerHTML = '';
    items.forEach(item => container.appendChild(createItemTile(item)));
    getActiveRoles().then(res => {
        let length = res.length;
        let isAdmin = false;
        for (let i = 0; i < length; i++) {
            if (res[i] === 'ROLE_ADMIN') {
                isAdmin = true;
                break;
            }
        }
        if (isAdmin) {
            tileAndItems.forEach(pair => {
                addAdminPanel(pair[0], pair[1], pair[2]);
            });
        }
    });

}

function createCategoryButtons(buttonsContainer) {
    let categories = ['Все товары'].concat(FOOD_CATEGORIES.concat(OTHER_CATEGORIES));
    categories.forEach(category => {
        let categoryButton = document.createElement('div');
        categoryButton.classList.add(CATEGORY_BUTTON);
        categoryButton.setAttribute('name', CATEGORY_BUTTON);
        categoryButton.innerHTML = capitalize(category);

        categoryButton.addEventListener("click", () => {
            itemsHeader.innerHTML = capitalize(category);
            showCatalog(category === 'Все товары' ? null : category).then();
        });

        buttonsContainer.appendChild(categoryButton);
    });
}

function createItemTile(item) {
    let itemTile = document.createElement('div');
    itemTile.classList.add(ITEM_TILE);

    let adminPanel = document.createElement('div');
    adminPanel.classList.add('tile-admin-panel');
    itemTile.appendChild(adminPanel);

    let itemImg = document.createElement('img');
    itemImg.src = imgPathByImgName(item.item.imagePath);
    itemImg.alt = capitalize(item.item.name);
    itemImg.title = 'Перейти на страницу товара';
    itemImg.addEventListener('error', function (event) {
        event.target.src = 'img/error/no-pictures.png';
    });
    itemImg.addEventListener('click', () => {
        window.location.href = 'item.html?name=' + item.item.name; //.replace(' ', '+');
    });
    itemTile.appendChild(itemImg);

    let itemName = document.createElement('h3');
    itemName.innerHTML = capitalize(item.item.name);
    itemName.title = capitalize(item.item.name);
    itemName.style = 'cursor: default;';
    itemTile.appendChild(itemName);

    if (isFoodCategory(item.item.category.name)) {
        let weightAndCalories = document.createElement('div');
        weightAndCalories.classList.add(ITEM_INFO);
        let weight = document.createElement('p');
        weight.innerHTML = item.weight + ' г.';
        weightAndCalories.appendChild(weight);
        let itemIngredients = document.createElement('p');
        itemIngredients.classList.add(INGREDIENT_LIST);
        let ingredients = item.ingredients;
        let ingredientsAmount = ingredients.length;
        let ingredientsToShow = [];
        for (let i = 0; i < ingredientsAmount; i++) {
            ingredientsToShow.push(`<span title="${ingredients[i].description}">${i === 0
                ? capitalize(ingredients[i].name)
                : ingredients[i].name}</span>`);
        }
        itemIngredients.innerHTML = ingredientsToShow.join(', ');
        itemTile.appendChild(itemIngredients);
        let calories = document.createElement('p');
        calories.innerHTML = item.calories + ' ккал';
        weightAndCalories.appendChild(calories);
        let amount = document.createElement('p');
        amount.innerHTML = `Количество: ${item.amount} шт.`;
        itemTile.appendChild(amount);
        itemTile.appendChild(weightAndCalories);
    }

    let costInfo = document.createElement('div');
    costInfo.classList.add(COST_INFO);

    let priceElement = document.createElement('p');
    let price = item.item.price;
    priceElement.innerHTML = price + '₽';
    if (`${price}`.length > 4) priceElement.setAttribute('style', 'font-size: 12px;');
    let remove = document.createElement('button');
    remove.innerHTML = 'X';
    remove.title = 'Удалить товар из корзины';
    remove.classList.add(REMOVE_FROM_SHOPCART);
    remove.addEventListener('click', () => deleteFromShopCart(item));
    let addToShoppingCart = document.createElement('button');
    addToShoppingCart.innerHTML = 'Добавить в корзину';
    addToShoppingCart.classList.add(ADD_TO_SHOPCART);
    addToShoppingCart.addEventListener('click', () => {
        getActiveRoles().then(res => {
            let length = res.length;
            let isAuthorized = false;
            for (let i = 0; i < length; i++) {
                if (res[i] === 'ROLE_USER') {
                    isAuthorized = true;
                    break;
                }
            }
            if (isAuthorized) {
                addToShopCart(item, amountInput.value);
            }
            else {
                let goToAuthorization = confirm('Для добавления товаров в корзину необходимо войти в аккаунт.' +
                    ' Перейти на страницу авторизации?');
                if (goToAuthorization) {
                    window.location.href = 'authorization.html';
                }
            }
        });

    });
    let amountInput = document.createElement('input');
    amountInput.setAttribute('type', 'number');
    amountInput.value = '1';

    let description = document.createElement('p');
    description.classList.add('item-description');
    let descriptionText = item.item.description;
    description.innerHTML = descriptionText;

    costInfo.appendChild(remove);
    costInfo.appendChild(amountInput);
    costInfo.appendChild(addToShoppingCart);
    costInfo.appendChild(priceElement);
    if (descriptionText !== '') itemTile.appendChild(description);
    itemTile.appendChild(costInfo);

    tileAndItems.push([adminPanel, item, itemTile]);

    return itemTile;
}

function addAdminPanel(cont, item, itemTile) {
    let childCont = document.createElement('div');
    let editBtn = document.createElement('div');
    editBtn.innerText = '✏';
    editBtn.style = 'color: blue; right: 30px; transform: rotate(45deg);';
    editBtn.title = 'Редактировать товар';
    editBtn.addEventListener('click', () => {
        window.location.href = `itemUpdateCreate.html?mode=update&id=${item['item']['id']}`;
    });
    let deleteBtn = document.createElement('div');
    deleteBtn.innerText = '❌';
    deleteBtn.style = 'color: red;';
    deleteBtn.title = 'Удалить товар';
    deleteBtn.addEventListener('click', async function () {
        let isDeleting = confirm(`Товар "${capitalize(item['item']['name'])}" будет удалён. Продолжить?`);
        if (isDeleting) {
            itemTile.parentNode.removeChild(itemTile);
            try {
                await fetch(getUrl(Endpoints.DELETE_CATALOG_ITEM) + '/' + item['item']['id'],
                    {method: 'POST'}).then(() => {
                        notify(`Товар "${capitalize(item['item']['name'])}" удалён`);
                });

            } catch {
            }
        }
    });
    childCont.appendChild(editBtn);
    childCont.appendChild(deleteBtn);
    cont.appendChild(childCont);
}

showCatalog(null).then();


let success = params.get('success');
if (success === 'reg') {
    setTimeout(() => notify('Регистрация прошла успешно!'), 100);
    const newUrl = new URL(location.href);
    newUrl.searchParams.delete('success');
    window.history.replaceState({}, document.title, newUrl.href);
}
else if (success === 'auth') {
    setTimeout(() => notify('Вы вошли в аккаунт!'), 100);
    const newUrl = new URL(location.href);
    newUrl.searchParams.delete('success');
    window.history.replaceState({}, document.title, newUrl.href);
}

