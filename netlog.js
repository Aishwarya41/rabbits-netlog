const fs = require('fs');
const path = require('path');
const { listenerCount } = require('process');
const { PassThrough } = require('stream');

// Check if a file path for netlog and url was provided
if (process.argv.length < 4) {
    console.log("Usage: node netlog.js <path_to_netlog_file> <path_to_urls_file>");
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

    // Get the file path from the command line arguments
    const urlPath = process.argv[3];

    // Check if the file exists
    if (!fs.existsSync(urlPath)) {
        console.log("The file does not exist.");
        process.exit(1);
    }

    //Read url from the file
    const urls = fs.readFileSync(urlPath) //turn it into an argument
    const urlJSON = JSON.parse(urls)

    events.forEach((element, index) => {
        if (element.trim() === ""){
            return;
        }
        if (element.slice(-2, -1) === ']}'){
            eachEvent = element.slice(0, -2);
        }
        else{
        eachEvent = element.slice(0, -1);}


        try {
            const eventData = JSON.parse(eachEvent);
            if (
                eventData.hasOwnProperty('params') &&
                typeof(eventData.params) === 'object' &&
                eventData.params.hasOwnProperty('url') &&
                (urlJSON.download.some(url => eventData.params.url.includes(url)) ||
                urlJSON.upload.some(url => eventData.params.url.includes(url)) &&
                eventData.type === 2
            )) {
                if (eventData.source.hasOwnProperty('id')) {
                    const id =  eventData.source ;
                    results.push({ sourceID:id, index: index, dict: eventData });
                }
            }
            if (
            results.some(result=>result.sourceID && result.sourceID.id === eventData.source.id )
            ){
                if (
                    (eventData.type === 123 || eventData.type === 122 ) && eventData.hasOwnProperty('params') && eventData.params.hasOwnProperty('byte_count')
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


//{id:'3382':[{bytecount:16384, time: '399903'},{}] //request & response time, url
//}

//t= 9460 [st=    5]             HTTP_TRANSACTION_SEND_REQUEST_HEADERS
//t= 9470 [st=   15]  type 181   HTTP_TRANSACTION_READ_RESPONSE_HEADERS
