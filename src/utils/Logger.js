export class Logger {
  constructor (fileName) {
    this.fileName = fileName
    this.isEnabled = this.checkLogStatus()
  }

  checkLogStatus () {
    const logSetting = localStorage.getItem('log')
    if (logSetting === 'all') {
      return true
    } else if (logSetting) {
      const enabledFiles = logSetting.split(',')
      return enabledFiles.includes(this.fileName)
    }
    return false
  }

  getCallingFunctionName () {
    try {
      // Capture the stack trace and extract the second frame, which is the caller
      const err = new Error()
      const stack = err.stack.split('\n')
      // Extract and return the calling function name (if available)
      const caller = stack[3] || '' // Adjust stack level based on environment (3rd line in Chrome, might be 4th in others)
      const match = caller.match(/at (\w+)/)
      return match ? match[1] : 'anonymous' // Return 'anonymous' if no match is found
    } catch (e) {
      return 'anonymous'
    }
  }

  logMessage (level, ...args) {
    if (this.isEnabled) {
      const functionName = this.getCallingFunctionName()
      const logPrefix = `[${this.fileName}][${functionName}]`
      console[level](`${logPrefix}`, ...args)
    }
  }

  log (...args) {
    this.logMessage('log', ...args)
  }

  warn (...args) {
    this.logMessage('warn', ...args)
  }

  error (...args) {
    this.logMessage('error', ...args)
  }

  info (...args) {
    this.logMessage('info', ...args)
  }

  static enableLogs (files = 'all') {
    localStorage.setItem('log', files)
  }

  static disableLogs () {
    localStorage.removeItem('log')
  }
}
