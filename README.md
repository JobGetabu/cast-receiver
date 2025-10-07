# Cast Receiver with Logging

## Quick Start

1. **Start the server:**
   ```bash
   node server.js
   ```

2. **Access the receiver:**
   - On your computer: http://localhost:8080

3. **View logs:**
   - On your computer: http://localhost:8080/logs.html
   - On your phone/tablet (same WiFi): http://YOUR_IP:8080/logs.html

## How to Find Your IP Address

### On Mac/Linux:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### On Windows:
```bash
ipconfig
```
Look for "IPv4 Address"

## How It Works

1. The Cast receiver runs and displays on your TV
2. All logs (console.log, console.error, etc.) are sent to the server
3. Open `/logs.html` on ANY device on the same network to view logs
4. Logs auto-refresh every 2 seconds
5. Logs are saved to `cast-logs.json` and persist across restarts

## Accessing Logs

**On TV/Receiver:**
- The URL to access logs is shown on screen in a blue box
- Example: `http://192.168.1.100:8080/logs.html`

**From Phone/Computer:**
1. Make sure you're on the same WiFi network
2. Open the URL shown on the TV
3. Logs will auto-refresh in real-time
4. Click "Download" to save logs as a text file

## Features

- ✅ Real-time logging visible on any device
- ✅ Auto-refresh (every 2 seconds)
- ✅ Download logs as text file
- ✅ Persistent storage (survives server restarts)
- ✅ Error highlighting (red for errors, orange for warnings)
- ✅ Detailed error information for debugging

## Troubleshooting

**Can't access logs from phone?**
- Make sure both devices are on the same WiFi
- Check firewall settings
- Try using your computer's IP instead of localhost

**Logs not showing?**
- Make sure the server is running (`node server.js`)
- Check that casting is working and generating logs
- Try refreshing the page

**Need to clear old logs?**
- Click the "Clear" button on logs.html
- Or delete `cast-logs.json` file
