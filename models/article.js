var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
    },
    link: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    saved: {
        type: Boolean, default: "false"
    },
    date: {
        type: Date, default: Date.now
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

ArticleSchema.index({
    link: 1,
}, {
    unique: true,
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;