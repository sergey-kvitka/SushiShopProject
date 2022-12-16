let itemsContainer = document.getElementById(ITEM_CATALOG_CONTAINER);

let itemsHeader = document.getElementById(ITEM_CATALOG_HEADER);

let categoriesPanel = document.getElementById('categories-panel-cont');

async function getAllItemsFromApi() {
    const response = await fetch(getUrl(Endpoints.GET_CATALOG_ITEMS));
    return await response.json();
}

async function showCatalog(category) {
    getAllItemsFromApi().then(items => {
        if (category != null) items = items.filter(item => item.item.category.name === category);
        showItems(items, itemsContainer);
    });
}

function showItems(items, container) {
    container.innerHTML = '';
    items.forEach(item => container.appendChild(createItemTile(item)));
}

function createCategoryButtons(buttonsContainer) {
    let categories = FOOD_CATEGORIES.concat(OTHER_CATEGORIES);
    categories.forEach(category => {
        let categoryButton = document.createElement('div');
        categoryButton.classList.add(CATEGORY_BUTTON);
        categoryButton.setAttribute('name', CATEGORY_BUTTON);
        categoryButton.innerHTML = capitalize(category);

        categoryButton.addEventListener("click", () => {
            itemsHeader.innerHTML = capitalize(category);
            showCatalog(category).then();
        });

        buttonsContainer.appendChild(categoryButton);
    });
}

function createItemTile(item) {
    let itemTile = document.createElement('div');
    itemTile.classList.add(ITEM_TILE);

    let itemImg = document.createElement('img');
    itemImg.src = imgPathByImgName(item.item.imagePath);
    itemTile.appendChild(itemImg);

    let itemName = document.createElement('h3');
    itemName.innerHTML = capitalize(item.item.name);
    itemTile.appendChild(itemName);

    if (isFoodCategory(item.item.category.name)) {
        let weightAndCalories = document.createElement('div');
        weightAndCalories.classList.add(ITEM_INFO);
        let weight = document.createElement('p');
        weight.innerHTML = item.weight + ' г.';
        weightAndCalories.appendChild(weight);
        let itemIngredients = document.createElement('p');
        itemIngredients.classList.add(INGREDIENT_LIST);
        itemIngredients.innerHTML = capitalize(
            item.ingredients
            .map(ingredient => `<span title="${ingredient.description}">${ingredient.name}</span>`)
            .join(', ')
        );
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
    let addToShoppingCart = document.createElement('button');
    addToShoppingCart.innerHTML = 'Добавить в корзину';
    addToShoppingCart.classList.add(ADD_TO_SHOPCART);
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

    return itemTile;
}

createCategoryButtons(categoriesPanel);

showCatalog(null).then();