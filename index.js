const fs = require('fs');

const dirsToExclude = ["node_modules"];

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " path/to/directory");
    process.exit(-1);
}

const directoryPath = process.argv[2];

parseFiles(directoryPath);
parseAngularJsonFile(directoryPath);

function parseAngularJsonFile(path) {
    const fileToChange = `${path}/angular.json`;

    fs.readFile(fileToChange, "utf8" ,function (err, data) {
        if (err) {
            throw err;
        }
        var result = data.replace(/\.css/g, '.scss');
        result = result.replace(/"css"|'css'/g, '\"scss\"');
    
        fs.writeFile(fileToChange, result, "utf8", function (err) {
            if (err) return console.log(err);
            console.log(`change the css reference of ${path}`)
        });
    });
}


function parseFiles(path) {
    
    fs.readdir(path, function(err, items) {
 
        for (var i=0; i<items.length; i++) {
            
            var file = path + '/' + items[i];

            let isDirectory = fs.lstatSync(file).isDirectory()

            const isExcluded = dirsToExclude.some( it => file.includes(it));

            if (isExcluded) {
                continue;
            }

            if (isDirectory) {

                parseFiles(file);

            } else {
                
                if (file.includes(".ts") && !file.includes(".spec.ts")) {
                    parseTsFile(file);
                }

                if (file.includes(".css")) {
                    parseCssFile(file);
                }
            }
        }
    });
}


function parseTsFile(path) {
    fs.readFile(path, "utf8" ,function (err, data) {
        if (err) {
            throw err;
        }
        var result = data.replace(/\.css/g, '.scss');
    
        fs.writeFile(path, result, "utf8", function (err) {
            if (err) return console.log(err);
            console.log(`change the css reference of ${path}`)
        });
    });
}


function parseCssFile(path) {
    const pathToScss = path.replace(/\.css/g, '.scss');
    fs.rename(path, pathToScss, function(err) {
        if ( err ) console.log('ERROR: ' + err);
        console.log(`change the css path to scss of ${path}`)
    });
}