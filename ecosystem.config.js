module.exports = {
  apps: [
    {
      name: "db-connect-checker-api",
      script: "index.js",
      cwd: "./server",
      instances: 1,
      autorestart: true,
      watch: false,
      time: true,
      env: {
        NODE_ENV: "production",
        PORT: "5000"
      }
    }
  ]
};
