module.exports = new (function (fs, yaml) {
    this.groupByN = function (collection, n) {
        var results = [];
        var group = [];

        collection.forEach((item) => {
            if (group.length === n) {
                results.push(group);
                group = [];
            }
            group.push(item);
        });
        results.push(group);
        
        return results;
    };
    
    this.readYAML = (path, callback) => {
        fs.readFile(path, (err, contents) => {
            if (err) return callback(err);

            var o = yaml.safeLoad(contents);
            
            callback(null, o);
        });
    }
})(require("fs"), require("js-yaml"));