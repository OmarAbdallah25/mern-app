const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));

app.get("/", function (req, res) {
  res.send("App is running");
});

const dbo = require("./db/conn");

// 1) On se connecte d'abord à MongoDB, 2) puis on démarre l'API
dbo.connectToMongoDB()
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log("Server is running on port: " + port);
    });
  })
  .catch((error) => {
    console.error("Impossible de démarrer : MongoDB injoignable", error.message);
    process.exit(1); // le conteneur s'arrête -> Docker le relance (restart policy)
  });