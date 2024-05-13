const fs = require('fs');


// Function to read a file synchronously
const parseJSONFromFile = (filePath) => {
    const fileContent = fs.readFileSync(filePath);
    return JSON.parse(fileContent);
};


const data = parseJSONFromFile("output/byte_time_list.json")

// Function to calculate duration in milliseconds
function calculateDuration(progress) {
    const startTime = parseInt(progress[0].time);
    const endTime = parseInt(progress[progress.length - 1].time);
    return endTime - startTime;
}

// Function to calculate throughput for each ID
function calculateThroughput(data) {
    const throughputMap = {};

    // Loop through each upload data
    data.forEach(upload => {
        const id = upload.id;
        const progress = upload.progress;

        // Calculate duration for this progress
        const duration = calculateDuration(progress);

        // Sum byte counts for this progress
        let totalByteCount = 0;
        progress.forEach(progressObj => {
        totalByteCount += progressObj.bytecount;
        });

        // Calculate throughput in bytes per millisecond
        const throughput = totalByteCount / duration;

        // Convert throughput to bytes per second
        const throughputBytesPerSecond = throughput * 1000;

        // Store throughput for this ID
        throughputMap[id] = throughputBytesPerSecond;
    });

    return throughputMap;
}

const throughputByIDs = calculateThroughput(data);
console.log("Throughput by IDs:", throughputByIDs);
