/**
 * Created by reselbob on 3/31/16.
 */
var express = require('express');
var router = express.Router();
var fs = require("fs");
var dir = require('node-dir');

var swaggerDir = "/Users/reselbob/WebstormProjects/H2WellnessDocParser/swagger";
var methodListFilespec = "/Users/reselbob/WebstormProjects/H2WellnessDocParser/endpoints.txt";

/* GET users listing. */
router.get('/', function(req, res, next) {

    dir.files(swaggerDir, function(err, files) {
        files.forEach(function(path) {
            if(getExtension(path).toLowerCase() == '.json'){
                var contents = fs.readFileSync(path);
                var jsonContent = JSON.parse(contents);

                jsonContent.apis.forEach(function(api){
                    api.operations.forEach(function(operation){
                        var str = api.path + "," + operation.method.toLowerCase() + "\n";
                        console.log(str);
                        fs.appendFile(methodListFilespec, str, function (err) {

                        });
                    });


                });
            }


        });
    });
    res.send('I am lister');
});

function writeToFile(data){
    var fs = require('fs');
    var stream = fs.createWriteStream("my_cool_json.json");
    stream.once('open', function(fd) {
        stream.write(data);
        stream.end();
    });
}

function getExtension(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}


module.exports = router;