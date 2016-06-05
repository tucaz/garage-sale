module.exports = function(urls) {
    var url = require("url");
    
    return (req, res, next) => {
        var pathName = url.parse(req.url).pathname;
        
        urls.forEach((menuUrl) => {
           menuUrl.active = menuUrl.href === pathName; 
        });
        
        req.links = urls;
        
        next();  
    }; 
}