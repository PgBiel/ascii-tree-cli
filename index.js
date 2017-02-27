module.exports = (function(){
  var inquirer     = require("inquirer");
  var { generate } = require("ascii-tree");
  var fs           = require("fs");
  inquirer.prompt([{type: "list", name: "fileYesNo", message: "Will you use an editor to write down the ascii tree, or do you have file with it?", choices: ["Use editor", "Use already-existing file"]}]).then(function(answers){
    if (answers.fileYesNo == "Use editor") {
      inquirer.prompt([{type: "editor", name: "editIt", message: "Please write the tree (Example: #RootNode\\n##Sibling\\n###Sibling of Sibling\\n##Sibling of root node", validate: function(text){
        if (text.length < 1) return "Don't leave it empty!";
        try {
          generate(text);
        } catch (err) {
          return err.message;
        }
        return true;
      }}]).then(function(answer){
        console.log("\n\n\x1b[1mGenerated Tree:\x1b[0m\n\n" + generate(answer.editIt));
        process.exit(0);
      });
    } else {
      inquirer.prompt([{type: "input", name: "path", message: "Please insert the directory of the file. (Example: /Users/YourName/myfile.txt, or ./dir/file.txt)", validate: function(text){
        if (!(fs.existsSync(text))) return "Invalid path!";
        if (fs.accessSync(text, fs.R_OK)) return "No access to reading the file!";
        var thetext = fs.readFileSync(text);
        if (thetext.length < 1) return "File must not be empty!";
        if (/^\s+$/.test(thetext)) return "File must not be empty!";
        try {
          generate(fs.readFileSync(text));
        } catch (err) {
          return err.message;
        }
        return true;
      }}]).then(function(answer){
        var thetext = fs.readFileSync(answer.path);
        console.log("\n\n\x1b[1mGenerated Tree:\x1b[0m\n\n" + generate(thetext));
        process.exit(0);
      });
    }
  });
})();