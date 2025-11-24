/**
 * PM2 Ecosystem Configuration
 * For production deployment with PM2
 */

module.exports = {
  apps: [
    {
      name: 'imec-backend',
      cwd: './backend',
      script: 'src/server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
    {
      name: 'imec-sync',
      cwd: './backend',
      script: 'scripts/sync.js',
      args: 'continuous',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/sync-error.log',
      out_file: './logs/sync-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
    },
  ],
};
