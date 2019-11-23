const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

app.use("/public", express.static("resources/public"));
app.use("/static", express.static("resources/static"));

app.use((req, res, next) => {
	next();
});

app.use("/api", express.json(), require("./app/routes/api/"));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname + "/resources/views/index.html"));
});

const PORT = process.env.PORT;
app.listen(PORT, _ => console.log(`Listening on port ${PORT}`));
