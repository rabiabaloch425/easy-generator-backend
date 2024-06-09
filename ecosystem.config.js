module.exports = {
  apps : [{
    name: "rest-api",
    script: "./dist/main.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}