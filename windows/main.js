const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const BrowserDetector = require('./app/Backend/BrowserDetector');

// To Update the Running Apps in the Background
async function updateAppList(win) {
    try {
        const apps = await BrowserDetector.getRunningApps();
        
        if (win && !win.isDestroyed()) {
            win.webContents.send('apps-updated', apps);
            
            if (apps.error) {
                console.warn('Detection warning:', apps.error);
            }
        }
    } catch (error) {
        console.error('Error in updateAppList:', error);
        
        // Send error state to renderer
        if (win && !win.isDestroyed()) {
            win.webContents.send('apps-updated', {
                browsers: [],
                screenSharing: [],
                videoConference: [],
                error: 'Detection failed'
            });
        }
    }
}

function createWindow() {
    let win = null;
    let updateInterval = null;

    try {
        win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            },
            frame: true,
        });

        win.maximize();
        win.setResizable(true);
        win.setMenuBarVisibility(true);

        // Load the index.html file
        win.loadFile(path.join(__dirname, 'app/UI/index.html'))
            .catch(error => console.error('Error loading index.html:', error));

        // Initial update
        updateAppList(win);

        // Set up interval for updates
        updateInterval = setInterval(() => updateAppList(win), 3000);

        win.on('closed', () => {
            if (updateInterval) {
                clearInterval(updateInterval);
            }
            win = null;
        });

        // Handle popup windows
        win.webContents.setWindowOpenHandler(({ url }) => {
            try {
                const popupWindow = new BrowserWindow({
                    width: 800,
                    height: 600,
                    frame: true,
                    webPreferences: {
                        nodeIntegration: false,
                        contextIsolation: true
                    }
                });

                popupWindow.loadURL(url)
                    .catch(error => console.error('Error loading popup URL:', error));
                
                popupWindow.setMenuBarVisibility(false);
                
                return { action: 'deny' };
            } catch (error) {
                console.error('Error handling popup window:', error);
                return { action: 'deny' };
            }
        });
    } catch (error) {
        console.error('Error creating window:', error);
        if (updateInterval) {
            clearInterval(updateInterval);
        }
        app.quit();
    }
}

app.whenReady()
    .then(createWindow)
    .catch(error => {
        console.error('Error in app initialization:', error);
        app.quit();
    });

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Handle any unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});