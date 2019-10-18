var express = require("express");
var mongoose = require("mongoose");
var handlebars = require("handlebars");

var PORT = process.env.PORT || 8080;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true });

require("./controllers/controller.js")(app);

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});