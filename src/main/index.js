import { app, BrowserWindow, Tray, Menu } from 'electron'
import run from '../music/src/app'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`

let isRunning = false
stop()

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    show: false,
    width: 64,
    height: 64,
    frame: false,
    fullscreenable: false,
    skipTaskbar: true,
    resizable: false,
    transparent: true,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const tray = new Tray(`${__static}/icon/music_iconTemplate.png`)

  tray.on('right-click', () => {
    tray.popUpContextMenu(Menu.buildFromTemplate(createMenuTemplate()))
  })
  tray.on('click', () => {
    tray.popUpContextMenu(Menu.buildFromTemplate(createMenuTemplate()))
  })
}

function createMenuTemplate() {
  return [
    {
      label: `状态：${isRunning ? '运行中' : '已停止'}`,
      enabled: false
    },
    {
      label: `${isRunning ? '停止' : '启动'}`,
      click: () => {
        if(isRunning){
          
        }else{
          run('80:443', "59.111.181.60")
        }
        isRunning = !isRunning
      }
    },
    {
      label: '退出',
      role: 'quit'
    }
  ]
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('before-quit', () => {
  stop()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'
autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})
app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
