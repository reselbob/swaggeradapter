/**
 * Created by reselbob on 4/1/16.
 */
var express = require('express');
var router = express.Router();
var fs = require("fs");
var dir = require('node-dir');
var dataToScrub = "/Users/reselbob/Documents/H2Wellness/data/non-na-data.txt";
var o = [];
//o.root = [];
/* GET users listing. */
router.get('/', function(req, res, next) {


    var lineByLine = require('n-readlines');
    var liner = new lineByLine(dataToScrub);

    var line;
    var lineNumber = 0;
    while (line = liner.next()) {
        var obj = {};
        var arr = line.toString('ascii').split(",");
        obj.endpoint = arr[0];
        obj.operation = arr[1];
        obj.categories = [];
        for(var i = 2;i<7;i++){
            if(arr[i] != "") obj.categories.push(arr[i]);
        }
        obj.catIsGood = isCategoriesGood(obj.categories);


        o.push(obj);
        //console.log('Line ' + lineNumber + ': ' + line.toString('ascii'));
    }

    //console.log('end of line reached');
    writeToFile(JSON.stringify(o));

    res.send(JSON.stringify(o));
});

module.exports = router;

function writeToFile(data) {
    var scrubbed = "/Users/reselbob/Documents/H2Wellness/data/scrubbed.json"
    var fs = require('fs');
    var stream = fs.createWriteStream(scrubbed);
    stream.once('open', function (fd) {
        stream.write(data);
        stream.end();
    });
}

function isCategoriesGood(categories){
    var b = false;
    categories.forEach(function(cat){
        if(!isEmpty(cat)){
            b =  true;
        }

    });
    return b;
}
function isEmpty(str) {
    return (!str || 0 === str.length);
}
