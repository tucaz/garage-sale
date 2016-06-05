module.exports = new(function (helpers) {
    var self = this,
        configFile = "./config.yaml";

    this.config = null;
    this.about = null;

    this.init = (callback) => {
        if (self.config && self.about) {
            callback(null);
        } else {
            loadConfig((err, config) => {
                loadConfiguration(config);
                loadAboutPage(config);
                callback(null);
            });
        }
    };

    var loadConfig = (callback) => {
        helpers.readYAML(configFile, callback);
    }
    
    var loadConfiguration = (config) => {
        self.config = {
            siteName: config.siteName,
            email: config.email,
            language: config.language
        };
    }
    
    var loadAboutPage = (config) => {
        self.about = config.about;
    }

})(require("./helpers.js"));