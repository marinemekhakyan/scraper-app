var cheerio = require("cheerio");
var db = require("../models");
var request = require("request");
var Promise = require("bluebird")

module.exports = function (app) {
    app.get("/", function (req, res) {
        request.get("https://www.latimes.com/travel", function (error, response, body) {
            console.log("Error: ", error);
            console.log("statusCode: ", response && response.statusCode);

            var $ = cheerio.load(body);
            var allArticles = { "articles": [] };

            Promise.each($(".ListW-items").get(), function (newArticles) {
                console.log(newArticles);
                var result = {};
                result.title = $(newArticles).find("PromoSmall-title").text().trim();
                result.summary = $(newArticles).find("PromoSmall-description").text().trim();
                result.link = $(newArticles).find("a").attr("href");
                result.image = $(newArticles).find("img").attr("data-src");

                allArticles.articles.push(result);
            })
                .then(function () {
                    updateDB(allArticles);
                    res.redirect("/articles");
                }).catch(function (err) {
                    console.error("Error scraping articles!");
                });

        });
    })

    function updateDB(result) {
        for (var i = result.articles.length - 1; i >= 0; i--) {
            db.Article.create(result.articles[i])
                .then(function (dbArticle) {

                }).catch(function (err) {
                    console.error("Error!");
                    // res.json(err);
                });
        }
    }

    app.get("/articles", function (req, res) {
        console.log("/articles");

        db.Article.find({ saved: "false" }).sort([["date", -1]])
            .then(function (dbArticle) {
                var hbsObject = {
                    articles: dbArticle
                }
                console.log(hbsObject);
                res.render("index", hbsObject);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.get("/mynews", function (req, res) {
        console.log("/mynews");

        db.Article.find({ saved: "true" }).sort([["date", -1]])
            .populate("notes")
            .then(function (dbArticle) {
                var hbsObject = {
                    articles: dbArticle
                }
                console.log(hbsObject)
                res.render("news", hbsObject);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.get("/articlenote/:id", function (req, res) {
        console.log("/articlenote")
        db.Article.findOne({ _id: req.params.id })
            .populate("notes")
            .then(function (dbArticle) {
                console.log(dbArticle);
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.put("/articles/save/:id", function (req, res) {
        db.Article.findByIdAndUpdate({ _id: req.params.id }, { $set: { saved: true } })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.put("/articles/unsave/:id", function (req, res) {
        db.Article.findByIdAndUpdate({ _id: req.params.id }, { $set: { saved: false } })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.post("/articlenote/:id", function (req, res) {
        console.log(req.body)
        let counternotes = 0;
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Article.findByIdAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.delete("/notes/delete/:id", function (req, res) {
        db.Note.findByIdAndDelete({ _id: req.params.id })
            .then(function (dbNote) {
                res.json(dbNote)
            })
            .catch(function (err) {
                res.json(err);
            });
    });
}