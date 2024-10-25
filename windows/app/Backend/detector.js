const { exec } = require('child_process');
const os = require('os');
const { ipcMain } = require('electron');

class BrowserDetector {
    static getRunningApps() {
        return new Promise((resolve) => {
            try {
                const platform = os.platform();
                let command = '';
                
                if (platform === 'win32') {
                    command = 'powershell "Get-Process | Select-Object ProcessName; Get-CimInstance Win32_DesktopMonitor | Select-Object ScreenHeight"';
                } else if (platform === 'darwin') {
                    command = 'ps -axo comm';
                } else if (platform === 'linux') {
                    command = 'ps aux';
                } else {
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

                        // Detect browsers and video apps
                        this.detectBrowsers(output, runningApps);
                        await this.detectVideoApps(output, runningApps);

                        // Check for screen sharing
                        if (platform === 'win32') {
                            this.detectWindowsScreenSharing(output, runningApps);
                        } else {
                            this.detectScreenSharing(output, platform, runningApps);
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

    static detectBrowsers(output, runningApps) {
        try {
            const browsers = [
                { name: 'Google Chrome', process: ['chrome', 'chrome.exe'] },
                { name: 'Firefox', process: ['firefox', 'firefox.exe'] },
                { name: 'Safari', process: ['safari', 'safari.exe'] },
                { name: 'Microsoft Edge', process: ['msedge', 'msedge.exe'] },
                { name: 'Opera', process: ['opera', 'opera.exe'] },
                { name: 'Brave', process: ['brave', 'brave.exe'] }
            ];

            browsers.forEach(browser => {
                if (browser.process.some(proc => output.includes(proc))) {
                    runningApps.browsers.push(browser.name);
                }
            });
        } catch (error) {
            console.error('Browser detection error:', error);
        }
    }

    static async detectVideoApps(output, runningApps) {
        try {
            const videoApps = [
                { name: 'Zoom', process: ['zoom', 'zoom.exe'] },
                { name: 'Microsoft Teams', process: ['teams', 'teams.exe'] },
                { name: 'Skype', process: ['skype', 'skype.exe'] },
                { name: 'Cisco Webex', process: ['webex', 'webexmta.exe'] },
                { name: 'Slack', process: ['slack', 'slack.exe'] },
                { name: 'Discord', process: ['discord', 'discord.exe'] }
            ];

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

            // Detect Google Meet through Chrome processes and tabs
            await this.detectVideoMeetings(output, runningApps);
            
        } catch (error) {
            console.error('Video app detection error:', error);
        }
    }

    static async detectVideoMeetings(output, runningApps) {
        try {
            // Common browser processes across platforms
            const browserProcesses = [
                // Chrome and Chromium-based
                'chrome', 'chrome.exe', 
                'msedge', 'msedge.exe',
                'brave', 'brave.exe',
                'vivaldi', 'vivaldi.exe',
                'opera', 'opera.exe',
                
                // Firefox
                'firefox', 'firefox.exe',
                'firefoxdeveloperedition',
                
                // Safari
                'safari', 'Safari',
                'safaritechnologypreview',
                
                // Generic browser processes for Linux
                'chromium',
                'chromium-browser',
                'firefox-esr'
            ];
    
            // Define supported meeting platforms and their URL patterns
            // Added more comprehensive patterns to catch Firefox's full URLs
            const meetingPlatforms = [
                {
                    name: 'Google Meet',
                    patterns: [
                        'meet.google.com',
                        'https://meet.google.com',
                        'http://meet.google.com'
                    ],
                    processNames: [...browserProcesses]
                },
                {
                    name: 'Microsoft Teams',
                    patterns: [
                        'teams.microsoft.com', 
                        'teams.live.com',
                        'https://teams.microsoft.com',
                        'https://teams.live.com'
                    ],
                    processNames: [...browserProcesses, 'teams', 'teams.exe']
                },
                {
                    name: 'Zoom',
                    patterns: [
                        'zoom.us',
                        'https://zoom.us',
                        'http://zoom.us'
                    ],
                    processNames: [...browserProcesses, 'zoom', 'zoom.exe']
                },
                {
                    name: 'Webex',
                    patterns: [
                        'webex.com',
                        'https://webex.com',
                        'http://webex.com'
                    ],
                    processNames: [...browserProcesses, 'webex', 'webexmta.exe']
                },
                {
                    name: 'Slack Huddles',
                    patterns: [
                        'app.slack.com/huddle',
                        'https://app.slack.com/huddle',
                        'http://app.slack.com/huddle'
                    ],
                    processNames: [...browserProcesses, 'slack', 'slack.exe']
                },
                {
                    name: 'Discord',
                    patterns: [
                        'discord.com/channels/',
                        'discordapp.com/channels/',
                        'https://discord.com/channels/',
                        'https://discordapp.com/channels/'
                    ],
                    processNames: [...browserProcesses, 'discord', 'discord.exe']
                }
            ];
    
            // Check if any supported browsers or platform-specific apps are running
            for (const platform of meetingPlatforms) {
                const hasSupportedApp = platform.processNames.some(proc => output.includes(proc));
    
                if (hasSupportedApp) {
                    // Construct platform-specific search command with enhanced pattern matching
                    let searchCommand = '';
                    // Join patterns with proper escaping and optional https/http prefix
                    const searchPatterns = platform.patterns
                        .map(pattern => pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                        .join('|');
    
                    if (os.platform() === 'win32') {
                        // Enhanced Windows pattern matching
                        searchCommand = `powershell "Get-Process | Where-Object {${platform.patterns.map(pattern => 
                            `($_.MainWindowTitle -like '*${pattern}*' -or $_.MainWindowTitle -like '*https://${pattern}*' -or $_.MainWindowTitle -like '*http://${pattern}*')`
                        ).join(' -or ')}} | Select-Object MainWindowTitle"`;
                    } else if (os.platform() === 'darwin') {
                        // Enhanced macOS command with better pattern matching
                        searchCommand = `ps ax -o command | grep -iE '(${searchPatterns})'`;
                    } else if (os.platform() === 'linux') {
                        // Enhanced Linux command with better pattern matching
                        searchCommand = `ps aux | grep -iE '(${searchPatterns})'`;
                    }
    
                    // Execute the search command with improved error handling
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
    
                    // Add to running apps if meeting is detected
                    if (meetingResult) {
                        runningApps.videoConference.push({
                            name: platform.name,
                            isInMeeting: true,
                            isSharingScreen: false  // Will be updated by screen sharing detection
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Video meeting detection error:', error);
        }
    }

    static detectWindowsScreenSharing(output, runningApps) {
        try {
            const screenSharingProcesses = [
                'ScreenClippingHost.exe',
                'ScreenRecording.exe',
                'ScreenClipping.exe',
                'SnippingTool.exe',
                'streamlabs obs',
                'obs64.exe',
                'obs.exe',
                'bdcam.exe',
                'camtasia.exe',
                'CamtasiaStudio.exe',
                'TeamViewer.exe'
            ];

            const hasScreenSharingProcess = screenSharingProcesses.some(proc => 
                output.toLowerCase().includes(proc.toLowerCase())
            );

            // Check if any video conference app is actively sharing screen
            const videoAppsWithScreenShare = runningApps.videoConference.some(app => 
                ['zoom', 'microsoft teams', 'cisco webex', 'google meet'].some(screenShare => 
                    app.name.toLowerCase().includes(screenShare.toLowerCase())
                )
            );

            const isCapturingScreen = output.includes('desktopmonitor') && 
                                    output.includes('screencapture');

            runningApps.isScreenSharing = hasScreenSharingProcess || 
                                        videoAppsWithScreenShare || 
                                        isCapturingScreen;

            // Update screen sharing status for video apps
            if (runningApps.isScreenSharing) {
                runningApps.videoConference = runningApps.videoConference.map(app => ({
                    ...app,
                    isSharingScreen: app.isSharingScreen || 
                        ['zoom', 'microsoft teams', 'cisco webex', 'google meet'].some(screenShare => 
                            app.name.toLowerCase().includes(screenShare.toLowerCase())
                        )
                }));
            }
        } catch (error) {
            console.error('Windows screen sharing detection error:', error);
        }
    }

    static detectScreenSharing(output, platform, runningApps) {
        try {
            const screenSharingIndicators = [
                { name: 'Screen Sharing', process: 'screencapture' },
                { name: 'Screen Recording', process: 'screenrecording' },
                { name: 'Screen Capture', process: 'ffmpeg' }
            ];

            const hasScreenSharingProcess = screenSharingIndicators.some(indicator => 
                output.includes(indicator.process)
            );

            // Check video apps screen sharing
            const videoAppsWithScreenShare = runningApps.videoConference.some(app => 
                ['zoom', 'microsoft teams', 'cisco webex', 'google meet'].some(screenShare => 
                    app.name.toLowerCase().includes(screenShare.toLowerCase())
                )
            );

            runningApps.isScreenSharing = hasScreenSharingProcess || videoAppsWithScreenShare;

            // Update individual app screen sharing status
            if (runningApps.isScreenSharing) {
                runningApps.videoConference = runningApps.videoConference.map(app => ({
                    ...app,
                    isSharingScreen: app.isSharingScreen || 
                        ['zoom', 'microsoft teams', 'cisco webex', 'google meet'].some(screenShare => 
                            app.name.toLowerCase().includes(screenShare.toLowerCase())
                        )
                }));
            }

            // Additional Mac-specific check
            if (platform === 'darwin') {
                this.detectMacScreenSharing(runningApps);
            }
        } catch (error) {
            console.error('Screen sharing detection error:', error);
        }
    }

    static detectMacScreenSharing(runningApps) {
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
}

module.exports = BrowserDetector;