const FOOD_CATEGORIES = ['классические роллы', 'роллы-перевёртыши', 'жареные роллы',
    'запечёные роллы', 'суши', 'специи и соусы', 'сеты']

const OTHER_CATEGORIES = ['дополнительно']

const ITEM_CATALOG_CONTAINER = 'item-catalog-cont';

const ITEM_CATALOG_HEADER = 'item-catalog-header';

const ITEM_TILE = 'item-tile-class'

const INGREDIENT_LIST = 'ingredient-list';

const ITEM_INFO = 'item-info';

const COST_INFO = 'cost-info';

const REMOVE_FROM_SHOPCART = 'remove-from_shop-cart';

const ADD_TO_SHOPCART = 'add-to-shop-cart';

const CATEGORY_BUTTON = 'category-button';

const LOCALHOST = 1468;

class Endpoints {
    static GET_CATALOG_ITEMS = 'catalog/getAllCatalogItems';
    static GET_CATEGORIES = 'catalog/getCategories';
}

function getUrl(endpoint) {
    return `http://localhost:${LOCALHOST}/api/${endpoint}`;
}

function isFoodCategory(category) {
    return FOOD_CATEGORIES.includes(category);
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function imgPathByImgName(name) {
    return `img\\${name}`;
}

function header() {

}