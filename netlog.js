const fs = require('fs');
const path = require('path');
const { listenerCount } = require('process');

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

    // Split data by lines and skip the first two lines
    const events = data.split('\n').slice(2);

    const results = [];
    const byte_time = [];

    //Read url from the file
    const urls = fs.readFileSync('ookla_urls.txt')
    const urlJSON = JSON.parse(urls)

    events.forEach((element, index) => {
        if (index < events.length - 2) {
            eachEvent = element.slice(0, -1);
        } else {
            eachEvent = element.slice(0, -2);
        }

        try {
            const eventData = JSON.parse(eachEvent);
            if (
                eventData.hasOwnProperty('params') &&
                typeof(eventData.params) === 'object' &&
                eventData.params.hasOwnProperty('url') &&
                urlJSON.download.some(url => eventData.params.url.includes(url)) &&
                eventData.type === 2
            ) {
                if (eventData.source.hasOwnProperty('id')) {
                    const id =  eventData.source ;
                    results.push({ sourceID:id, index: index, dict: eventData });
                }
            }
            if (
            results.some(result=>result.sourceID && result.sourceID.id === eventData.source.id )
            ){
                if (
                    eventData.type = 123 && eventData.hasOwnProperty('params') && eventData.params.hasOwnProperty('byte_count')
                ){
                    byte_time.push({id:eventData.source.id, bytecount: eventData.params.byte_count, time: eventData.time})
                }
            }
        } catch (error) {
            console.error("Error parsing line", index, ":", error);
        }
    });

    console.log(results);
    console.log(byte_time);
 });