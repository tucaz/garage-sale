module.exports = new(function () {
    var helpers = require("./helpers.js"),
        config = require("./config.js"),
        fs = require("fs"),
        async = require("async"),
        path = require("path"),
        _ = require("lodash"),
        numeral = require("numeral");
        language = require("numeral/languages/pt-br.js");
        
    numeral.language("pt-br", language);
    numeral.language("pt-br");

    var self = this,
        productsFile = "./products.yaml";

    this.isValid = (product) => {
        var errors = [];

        if (!product.name || product.name.trim() === "") {
            errors.push("name");
        }

        if (!product.price || isNaN(product.price) || product.price < 0) {
            errors.push("price");
        }

        if (!product.description || product.description.trim() === "") {
            errors.push("description");
        }

        if (!product.categories || !Array.isArray(product.categories) || product.categories.length == 0) {
            errors.push("categories");
        }

        if (!product.images || !Array.isArray(product.images) || product.categories.images == 0) {
            errors.push("images");
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    };

    this.loadAll = (callback) => {
        helpers.readYAML(productsFile, (err, products) => {
            async.map(products, (product, callback) => {
                var imagesFolder = path.join(__dirname, "public/images/products/", product.imagesFolder);
                fs.readdir(imagesFolder, (err, files) => {
                    if (err) return callback(err);

                    product.images = _.map(files, (file) => {
                        return product.imagesFolder + "/" + file;
                    });

                    if (product.images && product.images.length > 0)
                        product.mainImage = product.images[0];
                        
                    product.price = numeral(product.price).format("$0,0.00");

                    callback(null, product);
                });
            }, (err, products) => {
                var r = [];

                _.times(10, () => {
                    products.forEach((product) => {
                        r.push(product);
                    });
                });

                callback(null, r);
            });
        });
    };
})();