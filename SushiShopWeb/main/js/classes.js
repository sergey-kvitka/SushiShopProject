class Food {
    constructor(id, name, price, amount, calories, weight, category, ingredients, imagePath, description) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.amount = amount;
        this.calories = calories;
        this.weight = weight;
        this.category = category;
        this.ingredients = ingredients;
        this.imagePath = imagePath;
        this.description = description;
    }
}

class Extra {
    constructor(id, name, price, category, imagePath, description) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.imagePath = imagePath;
        this.description = description;
    }
}