const { exec } = require('child_process');
const { getPlatformCommand } = require('./utils/processCommands');
const detectBrowsers = require('./detectors/browserDetector');
const { detectVideoApps } = require('./detectors/videoDetector');
const { detectWindowsScreenSharing, detectScreenSharing } = require('./detectors/screenShareDetector');

class BrowserDetector {
    static getRunningApps() {
        return new Promise((resolve) => {
            try {
                const { platform, command } = getPlatformCommand();
                
                if (!command) {
                    resolve({
                        browsers: [],
                        videoConference: [],
                        isScreenSharing: false,
                        error: 'Unsupported platform'
                    });
                    return;
                }

                exec(command, async (error, stdout, stderr) => {
                    if (error) {
                        console.error('Process detection error:', error);
                        resolve({
                            browsers: [],
                            videoConference: [],
                            isScreenSharing: false,
                            error: 'Process detection failed'
                        });
                        return;
                    }

                    try {
                        const output = stdout.toLowerCase();
                        const runningApps = {
                            browsers: [],
                            videoConference: [],
                            isScreenSharing: false,
                            error: null
                        };

                        // To detect Running Browsers
                        detectBrowsers(output, runningApps);

                        // To detect any video sharing apps
                        await detectVideoApps(output, runningApps);

                        if (platform === 'win32') {
                            detectWindowsScreenSharing(output, runningApps);
                        } else {
                            detectScreenSharing(output, platform, runningApps);
                        }

                        resolve(runningApps);
                    } catch (parseError) {
                        console.error('Parse error:', parseError);
                        resolve({
                            browsers: [],
                            videoConference: [],
                            isScreenSharing: false,
                            error: 'Process parsing failed'
                        });
                    }
                });
            } catch (error) {
                console.error('Unexpected error:', error);
                resolve({
                    browsers: [],
                    videoConference: [],
                    isScreenSharing: false,
                    error: 'Unexpected error occurred'
                });
            }
        });
    }
}

module.exports = BrowserDetector;