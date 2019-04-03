var oldPlaces = require('../v2/places.json');

for (var placeIndex = 0; placeIndex < oldPlaces.length; placeIndex ++) {
    var place = oldPlaces[placeIndex];
    var categoriesString = "";
    for (var i = 0; i < place.categories.length; i ++) {
        var category = place.categories[i];
        categoriesString += + category;

        if (i !== place.categories.length - 1) {
            categoriesString += ", ";
        }
    }
    place.categories = categoriesString;
}

console.log(JSON.stringify(oldPlaces));
