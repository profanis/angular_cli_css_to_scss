
const fs = require('fs');
const dirsToExclude = ["node_modules"];
let tsFilesCount = 0;
let cssFilesCount = 0;

exports.report = function() {
    console.log(`converted ${tsFilesCount} .ts files`);
    console.log(`converted ${cssFilesCount} .css files`);
}

exports.parseAngularJsonFile = function(path) {
    const fileToChange = `${path}/angular.json`;

    if (!fs.existsSync(fileToChange)) {
        console.log("Unable to find an 'angular.json' file");
        process.exit(-1);
    }

    fs.readFile(fileToChange, "utf8" , (err, data) => {
        if (err) {
            throw err;
        }
        let result = data.replace(/\.css/g, '.scss');
        result = result.replace(/"css"|'css'/g, '\"scss\"');
    
        fs.writeFile(fileToChange, result, "utf8", function (err) {
            if (err) {
                console.error(`Unable to parse file ${path}`, err);
                return;
            };
            console.info(`angular.json file is succesfully updated`);
        });
    });
}


exports.parseFiles = function(path) {
    
    try {
        const files = fs.readdirSync(path);
    
        for (let i=0; i<files.length; i++) {
            
            const file = path + '/' + files[i];
            const dirIsExcluded = dirsToExclude.some( it => file.includes(it));
    
            if (dirIsExcluded) {
                continue;
            }
    
            const isDirectory = fs.lstatSync(file).isDirectory();
            if (isDirectory) {
                this.parseFiles(file);
            } else {                
                if (file.includes(".ts") && !file.includes(".spec.ts")) {
                    parseTsFile(file);
                }
    
                if (file.includes(".css")) {
                    parseCssFile(file);
                }
            }
        }
    } catch (err) {
        console.error(`Unable to read dir ${path}`);
        return
    }
}


function parseTsFile(path) {

    try {
        const content = fs.readFileSync(path, "utf8");

        var result = content.replace(/\.css/g, '.scss');

        try {
            fs.writeFileSync(path, result, "utf8");
            tsFilesCount++;
        } catch (e) {
            console.error(`Unable to parse file ${path}`, err);
            return;
        }
        
        
    } catch (e) {
        console.error(`Unable to parse file ${path}`, e);
        return;
    }
}


function parseCssFile(path) {
    const pathToScss = path.replace(/\.css/g, '.scss');

    try {
        fs.renameSync(path, pathToScss);
        cssFilesCount++;
    } catch (e) {
        console.error(`Unable to parse file ${path}`, err);
        return;
    }
}