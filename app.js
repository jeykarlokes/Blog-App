var express  		 = require('express');
var app 			 = express();
var bodyParser 		 = require('body-parser');
var mongoose  		 = require('mongoose');
var expressSanitizer = require('express-sanitizer');
var methodOve4                                                                                                        rride   = require('method-override');

mongoose.connect('mongodb://localhost/restful_blog_app');
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

// title image body created 
var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	description: String,
	created:{type:Date,default:Date.now}
});

//  compile the model  
var blog  = mongoose.model('Blog',blogSchema);

// blog.create({
// 	title:'test blog',
// 	image:'https://images.unsplash.com/photo-1558980664-769d59546b3d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
// 	body:' hello this is a blog post'

// });

app.get('/',function(req,res)
{
	res.redirect('/blogs');
});


//  create route 
app.get('/blogs',function(req,res)
{	
	blog.find({},function(err,blogs)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			// console.log(blogs);
			res.render('index',{blogs:blogs});
		}
	})
});

//  new route 
app.get('/blogs/new',function(req,res)
{
	res.render('new');
})

app.post('/blogs',function(req,res)
{

	var new_blog = req.body.blog;

	blog.create(new_blog,function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.redirect('/blogs');
		}
	});
});

app.get('/blogs/:id',function(req,res)
{
	var id  = req.params.id;

	blog.findById(id,function (err,foundBlog)
	{
		if (err)
		{
			res.send('something went wrong ');
		}
		else
		{
			res.render('show',{blog:foundBlog});
		}
	});
});

app.get('/blogs/:id/edit',function(req,res)
{
	blog.findById(req.params.id,function(err,foundBlog)
	{
		if(err)
		{
			res.render('index');
		}
		else
		{
			res.render('edit',{blog:foundBlog});
		}
	})
});

app.put('/blogs/:id',function(req,res)
{

	// res.send('update route')
	// var new_id = req.params.id.slice(1,req.params.id.length);
	// console.log(new_id);
	// console.log(req.params.id);
	var new_id = req.params.id;
	
	blog.findByIdAndUpdate(new_id, req.body.blog, function (err,UpdatedBlog)
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			res.redirect('/blogs/'+new_id);
		}
	}
	);

});



// delete route

app.get('/blogs/:id/delete',function(req,res)
{
	// res.send('destroy route');
	blog.findByIdAndRemove(req.params.id,function(err)
	{
		if(err)
		{
			res.redirect('/blogs');
		}
		else
		{
			res.redirect('/blogs');
		}
	})
})


app.listen(3000,function()
{
	console.log('blog server is running');
})

