const app = require("./app");

const PORT = 3055;

const server = app.listen(PORT, () => {
  console.log(`eCommerce server listening on port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Server closed!"));
});
