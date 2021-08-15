module.exports = {
  apps: [
    {
      name: "pickan-server",
      script: "./app.js",
      instances: 5,
      exec_mode: `cluster`,
    },
  ],
};
