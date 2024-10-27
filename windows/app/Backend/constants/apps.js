/* 
    All The Browsers
    All The Video Apps
    All The Browser Process
    All The Meeting Platforms
    All The Screen Sharing Processes

    Are here 

*/

const browsers = [
    { name: 'Google Chrome', process: ['chrome', 'chrome.exe'] },
    { name: 'Firefox', process: ['firefox', 'firefox.exe'] },
    { name: 'Safari', process: ['safari', 'safari.exe'] },
    { name: 'Microsoft Edge', process: ['msedge', 'msedge.exe'] },
    { name: 'Opera', process: ['opera', 'opera.exe'] },
    { name: 'Brave', process: ['brave', 'brave.exe'] }
];

const videoApps = [
    { name: 'Zoom', process: ['zoom', 'zoom.exe'] },
    { name: 'Microsoft Teams', process: ['teams', 'teams.exe'] },
    { name: 'Skype', process: ['skype', 'skype.exe'] },
    { name: 'Cisco Webex', process: ['webex', 'webexmta.exe'] },
    { name: 'Slack', process: ['slack', 'slack.exe'] },
    { name: 'Discord', process: ['discord', 'discord.exe'] }
];

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

const screenSharingIndicators = [
    { name: 'Screen Sharing', process: 'screencapture' },
    { name: 'Screen Recording', process: 'screenrecording' },
    { name: 'Screen Capture', process: 'ffmpeg' }
];

module.exports = {
    browsers,
    videoApps,
    browserProcesses,
    meetingPlatforms,
    screenSharingProcesses,
    screenSharingIndicators
};