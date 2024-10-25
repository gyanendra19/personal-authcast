const { exec } = require('child_process');
const { videoApps, meetingPlatforms } = require('../constants/apps');
const { buildMeetingSearchCommand } = require('../utils/processCommands');
const os = require('os');

// Will detect the Video sharing app like Discord

async function detectVideoApps(output, runningApps) {
    try {
        // Detect regular video apps
        videoApps.forEach(app => {
            if (app.process.some(proc => output.includes(proc))) {
                runningApps.videoConference.push({
                    name: app.name,
                    isInMeeting: true,
                    isSharingScreen: false
                });
            }
        });

        // Detect browser-based video meetings
        await detectVideoMeetings(output, runningApps);
    } catch (error) {
        console.error('Video app detection error:', error);
    }
}

// Detect the Video Meetings here

async function detectVideoMeetings(output, runningApps) {
    try {
        for (const platform of meetingPlatforms) {
            const hasSupportedApp = platform.processNames.some(proc => output.includes(proc));

            if (hasSupportedApp) {
                const searchCommand = buildMeetingSearchCommand(os.platform(), platform.patterns);
                
                const meetingResult = await new Promise((resolve) => {
                    exec(searchCommand, (error, stdout) => {
                        if (error) {
                            console.warn(`Warning: Command execution for ${platform.name} returned error:`, error);
                            resolve(false);
                            return;
                        }
                        
                        const outputLower = stdout.toLowerCase();
                        const isInMeeting = platform.patterns.some(pattern => 
                            outputLower.includes(pattern.toLowerCase())
                        );
                        resolve(isInMeeting);
                    });
                });

                if (meetingResult) {
                    runningApps.videoConference.push({
                        name: platform.name,
                        isInMeeting: true,
                        isSharingScreen: false
                    });
                }
            }
        }
    } catch (error) {
        console.error('Video meeting detection error:', error);
    }
}

module.exports = {
    detectVideoApps
};