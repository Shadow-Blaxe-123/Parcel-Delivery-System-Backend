import server from "./app";

const startServer = () => {
  server.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

startServer();
