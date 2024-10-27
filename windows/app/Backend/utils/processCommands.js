const os = require('os');

function getPlatformCommand() {
    const platform = os.platform();
    let command = '';
    
    if (platform === 'win32') {
        command = 'powershell "Get-Process | Select-Object ProcessName; Get-CimInstance Win32_DesktopMonitor | Select-Object ScreenHeight"';
    } else if (platform === 'darwin') {
        command = 'ps -axo comm';
    } else if (platform === 'linux') {
        command = 'ps aux';
    }
    
    return { platform, command };
}

function buildMeetingSearchCommand(platform, patterns) {
    const searchPatterns = patterns
        .map(pattern => pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|');

    if (platform === 'win32') {
        return `powershell "Get-Process | Where-Object {${patterns.map(pattern => 
            `($_.MainWindowTitle -like '*${pattern}*' -or $_.MainWindowTitle -like '*https://${pattern}*' -or $_.MainWindowTitle -like '*http://${pattern}*')`
        ).join(' -or ')}} | Select-Object MainWindowTitle"`;
    } else if (platform === 'darwin') {
        return `ps ax -o command | grep -iE '(${searchPatterns})'`;
    } else if (platform === 'linux') {
        return `ps aux | grep -iE '(${searchPatterns})'`;
    }
    
    return '';
}

module.exports = {
    getPlatformCommand,
    buildMeetingSearchCommand
};
