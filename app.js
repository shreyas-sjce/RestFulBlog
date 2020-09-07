var bodyParser = require("body-parser"),
expressSanitizer = require("express-sanitizer"),
methodOverride = require("method-override"),
mongoose = require("mongoose"),
express = require("express"),
app = express();

mongoose.connect(("mongodb+srv://shreyas:Yashoda123@@cluster0-qoqhh.mongodb.net/test?retryWrites=true&w=majority"),{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: true
}).then(() => {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("ERROR:",err.message);
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("ERROR!");
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

app.get("/blogs/new", function(req,res){
	res.render("new");
});

app.post("/blogs", function(req,res){
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	});
});

app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else {
			res.render("show", {blog: foundBlog});
		}
	});
});

app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else{
			res.render("edit", {blog: foundBlog});
		}
	});
});

app.post("/blogs/:id", function(req,res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

app.get("/blogs/:id/delete", function(req,res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	})
});


/*Blog.create({
	title: "Rahul Dravid",
	image: "https://ichef.bbci.co.uk/news/1024/media/images/58967000/jpg/_58967421_rahuldraviddd464.jpg",
	body: "Sixer!!!"
});*/ 

app.listen(process.env.PORT || 3000,function(){
    console.log("Yelpcamp is just started");
});