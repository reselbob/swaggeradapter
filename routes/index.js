var express = require('express');
var router = express.Router();
var fs = require("fs");
var dir = require('node-dir');
var swaggerDir = "/Users/reselbob/WebstormProjects/H2WellnessDocParser/swagger";
var rootNodePath = "/Users/reselbob/WebstormProjects/H2WellnessDocParser/root-node.json";
var currentTag = "";

/* GET home page. */
router.get('/', function(req, res, next) {
  //traverse a directory and make an in-memory object of
  //each json file in the directory
  dir.files(swaggerDir, function(err, files) {

    var rootNode = getRootNode(rootNodePath);
    if (err) throw err;
    console.log(files);
    //we have an array of files now, so now we'll iterate that array
    files.forEach(function(path) {
      //traverse the array and get the endpoints, adding them to the root
      if(getExtension(path).toLowerCase() == '.json'){
        var contents = fs.readFileSync(path);

        currentTag = path.replace(swaggerDir,'');
        var lastslashindex = currentTag.lastIndexOf('/');
        currentTag = currentTag.substr(1,lastslashindex - 1);

        var jsonContent = JSON.parse(contents);
        //get the paths from each file
        jsonContent.apis.forEach(function(api){

          rootNode.paths[api.path] =  {};
          //put in the method
          api.operations.forEach(function(operation){
            rootNode.paths[api.path][operation.method.toLowerCase()] =  {};
            rootNode.paths[api.path][operation.method.toLowerCase()]["tags"] = [currentTag];
            rootNode.paths[api.path][operation.method.toLowerCase()]["description"] = "A placeholder description";
            //parameters
            rootNode.paths[api.path][operation.method.toLowerCase()]["parameters"] = scrubParams(operation.parameters);

            //add response to method
            rootNode.paths[api.path][operation.method.toLowerCase()]["responses"] = {};
            //add default to responses
            rootNode.paths[api.path][operation.method.toLowerCase()]["responses"]["default"]= {};
            rootNode.paths[api.path][operation.method.toLowerCase()]["responses"]["default"]["description"]= " Default TBD";
            //and two hundred
            rootNode.paths[api.path][operation.method.toLowerCase()]["responses"]["200"]= {};
            rootNode.paths[api.path][operation.method.toLowerCase()]["responses"]["200"]["description"]= "TBD";
            console.log(operation.method);
          });




        });
            // save the tree to disk
        var out = JSON.stringify(rootNode);
      }

    });

    writeToFile(JSON.stringify(rootNode));
  });

  res.render('index', { title: 'Express' });
});

function getRootNode(rootfile){
  var rt = fs.readFileSync(rootfile);
  var rtNode = JSON.parse(rt);
  return rtNode
}

String.prototype.replaceAll = function(str1, str2, ignore)
{
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

function scrubParams(param){
  //turn the param to a string and substitute
  //in for parameter type
  var str = JSON.stringify(param);



  str = str.replaceAll("paramType","in");
  str = str.replaceAll("form","formData");
  //if it is a form, get rid of allowMulitple
  //and set type to string
  var o = JSON.parse(str);
  o.forEach(function(p){
    if(p.in == "formData"){
      delete p.allowMultiple;
      p.type = "string";
      if(!p.description)p.description = "Description TBD";

    }
  });


  return o;
}

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
