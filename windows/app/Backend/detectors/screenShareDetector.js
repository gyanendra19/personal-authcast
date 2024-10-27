const { exec } = require('child_process');
const { screenSharingProcesses, screenSharingIndicators } = require('../constants/apps');

// To Detect if Windows is sharing the screen

function detectWindowsScreenSharing(output, runningApps) {
    try {
        const hasScreenSharingProcess = screenSharingProcesses.some(proc => 
            output.toLowerCase().includes(proc.toLowerCase())
        );

        const videoAppsWithScreenShare = checkVideoAppsScreenShare(runningApps);
        const isCapturingScreen = output.includes('desktopmonitor') && output.includes('screencapture');

        updateScreenSharingStatus(runningApps, hasScreenSharingProcess || videoAppsWithScreenShare || isCapturingScreen);
    } catch (error) {
        console.error('Windows screen sharing detection error:', error);
    }
}

// This will detect if screen is sharing like meet.google.com , etc..

function detectScreenSharing(output, platform, runningApps) {
    try {
        const hasScreenSharingProcess = screenSharingIndicators.some(indicator => 
            output.includes(indicator.process)
        );

        const videoAppsWithScreenShare = checkVideoAppsScreenShare(runningApps);
        updateScreenSharingStatus(runningApps, hasScreenSharingProcess || videoAppsWithScreenShare);

        if (platform === 'darwin') {
            detectMacScreenSharing(runningApps);
        }
    } catch (error) {
        console.error('Screen sharing detection error:', error);
    }
}

// For Mac Screen Detection

function detectMacScreenSharing(runningApps) {
    try {
        exec('ps aux | grep "Screen Sharing"', (error, stdout) => {
            if (!error && stdout.includes('Screen Sharing')) {
                runningApps.isScreenSharing = true;
            }
        });
    } catch (error) {
        console.error('MacOS screen sharing detection error:', error);
    }
}

// Will Check if the App is sharing the screen like Teams or Zoom

function checkVideoAppsScreenShare(runningApps) {
    return runningApps.videoConference.some(app => 
        ['zoom', 'microsoft teams', 'cisco webex', 'google meet'].some(screenShare => 
            app.name.toLowerCase().includes(screenShare.toLowerCase())
        )
    );
}

// Will update the status of screen sharing

function updateScreenSharingStatus(runningApps, isSharing) {
    runningApps.isScreenSharing = isSharing;

    if (isSharing) {
        runningApps.videoConference = runningApps.videoConference.map(app => ({
            ...app,
            isSharingScreen: app.isSharingScreen || 
                ['zoom', 'microsoft teams', 'cisco webex', 'google meet'].some(screenShare => 
                    app.name.toLowerCase().includes(screenShare.toLowerCase())
                )
        }));
    }
}

module.exports = {
    detectWindowsScreenSharing,
    detectScreenSharing
};