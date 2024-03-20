const fs = require('fs');
const path = require('path');

// Check if a file path was provided
if (process.argv.length < 3) {
    console.log("Usage: node processNetlog.js <path_to_netlog_file>");
    process.exit(1);
}

// Get the file path from the command line arguments
const filePath = process.argv[2];

// Check if the file exists
if (!fs.existsSync(filePath)) {
    console.log("The file does not exist.");
    process.exit(1);
}

// Read the content of the Netlog file
fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }

    // Process the data here
    //console.log("File content:", data);

    //going line by line

    // Split data by lines and skip the first two lines
    const lines = data.split('\n').slice(2);

    //parsedata = JSON.parse(data)
    
    // for (let item of parsedata.events) {
    //     console.log(item);
    // }
   //console.log(parsedata.events[1])
//   console.log(lines[0]);
   dictList = []
   lines.forEach((element, index) => {
        if (index < lines.length - 2) {
            dictList.push(element.slice(0, -1));
        } else {
            dictList.push(element.slice(0, -2));
        }
    });
   // console.log(dictList);
   const results = [];

//       // Iterate over each line
    for (let index = 0; index < dictList.length - 1; index++) {
        const line = dictList[index];
        try {

            const dict = JSON.parse(line);
            //console.log(dict)
            // Perform your operations here with 'dict'
            if (
                dict.hasOwnProperty('params') &&
                typeof(dict.params) === 'object' &&
                dict.params.hasOwnProperty('url') &&
                dict.params.url.includes("download?nocache") &&
                dict.type === 2
            ) {
                results.push({ index: index, dict: dict });
            }
        } catch (error) {
            console.error("Error parsing line", index, ":", error);
        }
    }

    console.log(results);

    const source_results = [];
    results.forEach((dict, index) => {
        if (dict.dict.source.hasOwnProperty('id')) {
            source_results.push({ dict: dict.dict.source });
        }
    });

   console.log(source_results);
 });