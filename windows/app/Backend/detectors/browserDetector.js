const { browsers } = require('../constants/apps');

function detectBrowsers(output, runningApps) {
    try {

        // Will go through the process to detect any browser is running
        browsers.forEach(browser => {
            if (browser.process.some(proc => output.includes(proc))) {
                runningApps.browsers.push(browser.name);
            }
        });
    } catch (error) {
        console.error('Browser detection error:', error);
    }
}

module.exports = detectBrowsers;