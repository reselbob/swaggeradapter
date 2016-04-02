/**
 * Created by reselbob on 4/1/16.
 */
/**
 * Created by reselbob on 3/31/16.
 */
var express = require('express');
var router = express.Router();
var fs = require("fs");
var dir = require('node-dir');

var validationData = "/Users/reselbob/Documents/H2Wellness/data/scrubbed.json";
var fullApi = "/Users/reselbob/Documents/H2Wellness/data/fullapi.json";

router.get('/', function(req, res, next) {
    var lineByLine = require('n-readlines');

    var apiTree = JSON.parse(fs.readFileSync(fullApi));
    var validationArr = JSON.parse(fs.readFileSync(validationData));
    var nukeArray = [];
    //clean out the garbage
    for (var path in apiTree.paths) {
        //get a path
        console.log(path);
        //go find the path in the validation tree
        validationArr.map( function(item) {
            if(item.endpoint == path){
                //take a look at the operatoin
                for (var operation in apiTree.paths[path]) {
                    if(operation == item.operation && !item.catIsGood){
                        //if categories are is not good, add it to the nuke array
                        nukeArray.push(path);
                    }
                }
            };
        });
    }
    //now remove the un-needed nodes from the tree
    nukeArray.map( function(item) {
        delete apiTree.paths[item];

     });

    //now let's retag
    for (var path in apiTree.paths){
  /*      if(path = "/user_devices/{id}/device_tiles/{fk}"){
            var t = 1;
        }*/
        console.log(path);
        for (var operation in apiTree.paths[path]){
            var tags = getTagsFromArray(validationArr,path,operation);
            apiTree.paths[path][operation].tags = tags;
            var q = 0;
        }

    }


    writeToFile(JSON.stringify(apiTree));

    
    res.send('Integration complete');
});

module.exports = router;

function writeToFile(data) {
    var scrubbed = "/Users/reselbob/Documents/H2Wellness/data/refinedApiTree.json"
    var fs = require('fs');
    var stream = fs.createWriteStream(scrubbed);
    stream.once('open', function (fd) {
        stream.write(data);
        stream.end();
    });
}

function getTagsFromArray(arr, path, operation) {
    var tags = [];
    arr.map( function(item) {
        if(item.endpoint == path && item.operation == operation){
            tags = item.categories;
        };
    });
    return tags;
}