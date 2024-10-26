document.addEventListener('DOMContentLoaded', function() {
    // Create app info container
    const appInfoContainer = document.createElement('div');
    appInfoContainer.id = 'app-info';
    appInfoContainer.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        z-index: 9999;
        min-width: 250px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(appInfoContainer);

    // Create embed element
    const embedElement = document.createElement('embed');
    embedElement.setAttribute('src', 'https://authcast.com/');
    embedElement.classList.add('full-embed');
    embedElement.style.overflowY = 'hidden';
    document.getElementById('embed-container').appendChild(embedElement);

    // Function to format video conference app details
    function formatVideoConferenceApp(app) {
        if (typeof app === 'string') {
            return `<div>• ${app}</div>`;
        }
        
        return `<div style="margin-left: -10px; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; margin-bottom: 5px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>• ${app.name}</div>
                            <span style="background: #44ff44; color: black; padding: 2px 6px; border-radius: 10px; font-size: 0.8em;">Active</span>
                    </div>
                </div>`;
    }

    // Listen for app updates from main process
    require('electron').ipcRenderer.on('apps-updated', (event, apps) => {
        const overallScreenSharing = apps.isScreenSharing || 
                                   apps.videoConference.some(app => 
                                       typeof app === 'object' && app.isSharingScreen
                                   );

        appInfoContainer.innerHTML = `
            <div style="margin-bottom: 12px; font-weight: bold; ${overallScreenSharing ? 'color: #ff4444;' : ''} display: flex; align-items: center; gap: 8px;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background: ${overallScreenSharing ? '#ff4444' : '#44ff44'}"></div>
                <div>Status: ${overallScreenSharing ? 'Screen can be shared' : 'Normal'}</div>
            </div>
            
            ${apps.browsers.length > 0 ? `
                <div style="margin-bottom: 12px;">
                    <div style="font-weight: bold; margin-bottom: 6px;">
                        <span style="color: #4488ff;">🌐 Browsers</span>
                    </div>
                    ${apps.browsers.map(browser => `<div>• ${browser}</div>`).join('')}
                </div>
            ` : ''}
            
            ${apps.videoConference.length > 0 ? `
                <div style="margin-bottom: 12px;">
                    <div style="font-weight: bold; margin-bottom: 6px;">
                        <span style="color: #ffaa44;">🎥 Video Conference</span>
                    </div>
                    ${apps.videoConference.map(app => formatVideoConferenceApp(app)).join('')}
                </div>
            ` : ''}

            ${apps.error ? `
                <div style="color: #ff4444; font-size: 0.9em; margin-top: 8px;">
                    ⚠️ ${apps.error}
                </div>
            ` : ''}
        `;
    });

    // Add hover effect to app info container
    appInfoContainer.addEventListener('mouseenter', () => {
        appInfoContainer.style.background = 'rgba(0, 0, 0, 0.9)';
    });

    appInfoContainer.addEventListener('mouseleave', () => {
        appInfoContainer.style.background = 'rgba(0, 0, 0, 0.8)';
    });
});