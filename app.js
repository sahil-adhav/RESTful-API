const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.set("strictQuery", false);

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser : true
});

const articleSchema = {
    title : String,
    content : String
}

const Article = mongoose.model("Article", articleSchema);

/* ############## REQUEST TARGETING ALL ARTICLES ############## */
app.route("/articles")
    
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if(!err){
                res.send(foundArticles);
            }
            else{
                res.send(err);
            }
        });
    })
    
    .post((req, res) => {
        const newArticle = new Article({
            title : req.body.title,
            content : req.body.content
        });
    
        newArticle.save((err) => {
            if(!err){
                res.send("Success : Added a new Article!");
            }
            else{
                res.send(err);
            }
        });
    })
    
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if(!err){
                res.send("Successfully deleted Articles.");
            }
            else{
                res.send(err);
            }
        });
    });

/* ############## REQUEST TARGETING SPECIFIC ARTICLE ############## */
app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({
            title : req.params.articleTitle}, 
            (err, foundArticle) => {
              if(!err){
                res.send(foundArticle);
              }
              else{
                res.send("No Articles Matching");
              }
        });
    })

    .put((req, res) => {
        Article.replaceOne(
            {title : req.params.articleTitle},
            {
                title : req.body.title,
                content : req.body.content
            },
            {overwrite : true},
            (err) => {
                if(!err){
                    res.send("Success : Update");
                }
                else{
                    console.log(err);
                    res.send(err);
                }
            }
        );
    })

    .patch((req, res) => {
        Article.updateOne(
            {title : req.params.articleTitle},
            {$set : req.body},
            (err) => {
                if(!err){
                    res.send("Success : patch");
                }
                else{
                    res.send(err);
                }
            } 
        );
    })

    .delete((req, res) => {
        Article.deleteOne(
            {title : req.params.articleTitle},
            (err) => {
                if(!err){
                    res.send("Success : Deleted");
                }
                else{
                    res.send(err);
                }
            }
        );
    });

app.listen(3000, () => {
    console.log("App running at 3000");
});