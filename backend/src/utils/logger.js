const pad = (n) => String(n).padStart(2, '0');
const ts = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

export const logger = {
  info: (...args) => console.log(`${colors.cyan}[${ts()}] INFO${colors.reset}`, ...args),
  warn: (...args) => console.warn(`${colors.yellow}[${ts()}] WARN${colors.reset}`, ...args),
  error: (...args) => console.error(`${colors.red}[${ts()}] ERROR${colors.reset}`, ...args),
  debug: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`${colors.gray}[${ts()}] DEBUG${colors.reset}`, ...args);
    }
  },
};
