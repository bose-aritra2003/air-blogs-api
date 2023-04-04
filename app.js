// Description: This file contains the code for the RESTful API for Air Blogs

//Required Modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose').default;


//Configure the app
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//Connect to the database
const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
async function main() {
    await mongoose.connect(`mongodb+srv://${db_username}:${db_password}@cluster0.nivlfhq.mongodb.net/blogsDB`);
    // await mongoose.connect(`mongodb://localhost:27017/blogsDB`);
}
main().catch(err => console.log(err));


//Create the Schema
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please check your post entry, no title specified!"]
    },
    subtitle: {
        type: String,
        required: [true, "Please check your post entry, no subtitle specified!"]
    },
    content: {
        type: String,
        required: [true, "Please check your post entry, no content specified!"]
    },
    author: {
        type: String,
        required: [true, "Please check your post entry, no author specified!"]
    },
    date: {
        type: String,
        required: [true, "Please check your post entry, no date specified!"]
    }
});


//Create the Model
const Blog = mongoose.model("Blog", blogSchema);


//API Routes for bulk operations
app.route("/")

    //GET Route
    .get(async (req, res) => {
        await Blog.find()
            .then(async (foundBlogs) => res.send(foundBlogs))
            .catch(err => {res.send(err)});
    })

    //POST Route
    .post(async (req, res) => {
        const blog = new Blog({
            title: encodeURIComponent(req.body.title),
            subtitle: encodeURIComponent(req.body.subtitle),
            content: encodeURIComponent(req.body.content),
            author: encodeURIComponent(req.body.author),
            date: encodeURIComponent(req.body.date)
        });

        await blog.save()
            .then(() => {res.send("Successfully added a new blog");})
            .catch(err => res.send(err));
    })

    //DELETE Route
    .delete(async (req, res) => {
        await Blog.deleteMany()
            .then(() => res.send("Successfully deleted all blogs"))
            .catch(err => res.send(err));
    });


//API Routes for specific operations
app.route("/:blogId")

    //GET Route
    .get(async (req, res) => {
        await Blog.findOne({_id: req.params.blogId})
            .then(async (foundBlog) => res.send(foundBlog))
            .catch(err => res.send(err));
    })

    //PUT Route
    .put(async (req, res) => {
        await Blog.replaceOne({_id: req.params.blogId}, {
            title: encodeURIComponent(req.body.title),
            subtitle: encodeURIComponent(req.body.subtitle),
            content: encodeURIComponent(req.body.content),
            author: encodeURIComponent(req.body.author),
            date: encodeURIComponent(req.body.date)
        })
            .then(() => res.send("Successfully replaced the blog"))
            .catch(err => res.send(err));
    })

    //PATCH Route
    .patch(async (req, res) => {
        await Blog.updateOne({_id: req.params.blogId}, {
            title: encodeURIComponent(req.body.title),
            subtitle: encodeURIComponent(req.body.subtitle),
            content: encodeURIComponent(req.body.content),
            author: encodeURIComponent(req.body.author),
            date: encodeURIComponent(req.body.date)
        })
            .then(() => res.send("Successfully updated the blog"))
            .catch(err => res.send(err));
    })

    //DELETE Route
    .delete(async (req, res) => {
        await Blog.deleteOne({_id: req.params.blogId})
            .then(() => res.send("Successfully deleted the blog"))
            .catch(err => res.send(err));
    });


//Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on port 3000");
});
