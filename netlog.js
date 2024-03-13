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
    parsedata = JSON.parse(data)
    
    // for (let item of parsedata.events) {
    //     console.log(item);
    // }
   //console.log(parsedata.events[1])


   const results = [];

   parsedata.events.forEach((dict, index) => {
       // Initialize to false for each dictionary
       let hasParamsAndUrl = false;

       // Check if 'params' exists and is an object, then check for 'url' inside 'params'
       if (dict.hasOwnProperty('params') 
       && typeof dict.params === 'object' 
       && dict.params.hasOwnProperty('url') 
       && dict.params.url.includes("download?nocache")
       && dict.type == "2" ) {
            hasParamsAndUrl = true;
            results.push({index:index, dict:dict })
       }
       // Add result for this dictionary to the results array
    //    results.push({
    //        index: index, // Keep track of which dictionary this result corresponds to
    //        hasParamsAndUrl: hasParamsAndUrl,
    });
    console.log(results)

    const source_results = []
    results.forEach((dict, index) => {
        if (dict.dict.source.hasOwnProperty('id')){
            source_results.push({dict:dict.dict.source})
        }
    }
    )

    console.log(source_results)
    // For example, you could convert JSON content or extract specific information here
    // if the Netlog file is in a structured format like JSON
    try {
        const json = JSON.parse(data);
        // Now you can work with the JSON object
    } catch (error) {
        console.error("Error parsing JSON from the file", error);
    }
});



//Main id = 4608
// other 3 is 4617, 4618, 4619


//to tun, node netlog.js /path/to/your/netlogfile.netlog


