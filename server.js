module.exports = new(function (http, express, jade, bodyParser, products, helpers, config, activeUrl) {
    var self = this,
        app = express(),
        server = http.createServer(app);

    var getMenu = () => {
        var urls = [
            { href: "/", text: "Home" },
            { href: "/about", text: "Sobre" }
        ];
        
        return urls;
    }
    
    app.set("view engine", "jade")
    app.set("views", __dirname + "/views");
    app.use("/public", express.static(__dirname + "/public"));
    app.use("/bower_components", express.static(__dirname + "/bower_components"));
    app.use(bodyParser.json());
    app.use(activeUrl(getMenu()));
    app.locals.pretty = true;

    app.get("/products", (req, res) => {
        products.loadAll((err, products) => {
            res.send(products);
            res.end();
        });
    });
    
    app.get("/", (req, res) => {
        products.loadAll((err, products) => {
            var rows = helpers.groupByN(products, 4);
            
            res.render("index.jade", { links: req.links, rows: rows });
        });
    });

    app.get("/about", (req, res) => {
        res.render("about.jade", { links: req.links, about: config.about });
    });

    app.get("/search", function (req, res) {
        var k = req.query.k,
            categories = req.query.categories,
            skip = req.query.skip,
            take = req.query.take;

        if (categories) {
            categories = categories.split(",");
        }

        products.search(k, categories, skip, take, function (err, response) {
            res.json(response);
        });
    });
    

    this.init = function (callback) {
        config.init((err) => {
           if(err) {
               console.log(err);
               console.log("Error while loading configuration file");
               return;
           }
           
           server.listen(process.env.PORT || 3001, process.env.IP || "localhost", function () {
               var addr = server.address();
               console.log("API server listening at", addr.address + ":" + addr.port);
           });
        });
    };
})(require("http"), require("express"), require("jade"), require("body-parser"), require("./products.js"), require("./helpers.js"), require("./config.js"), require("./middleware/activeUrl.js"));
