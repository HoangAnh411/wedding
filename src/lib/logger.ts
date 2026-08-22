type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export const logger = {
  log: (level: LogLevel, msg: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const logObj = { level, msg, timestamp, ...data };
    const logString = JSON.stringify(logObj);
    
    switch (level) {
      case 'info':
      case 'debug':
        console.log(logString);
        break;
      case 'warn':
        console.warn(logString);
        break;
      case 'error':
        console.error(logString);
        break;
    }
  },
  info: (msg: string, data?: any) => logger.log('info', msg, data),
  warn: (msg: string, data?: any) => logger.log('warn', msg, data),
  error: (msg: string, data?: any) => logger.log('error', msg, data),
  debug: (msg: string, data?: any) => logger.log('debug', msg, data),
};
