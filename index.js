console.log("hello");

const express = require('express');
const app = express()

// Start the server .listen starts the server
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
})

app.get('/',(req,res)=>{// to read the data GET
    res.send("Hello Express")
})

app.get('/about',(req,res)=>{
  // res.send("This is gallery page")
  res.send({// sends returs everything like json text array 
    name: 'akash',
    age:25
  });
  //res.json or res.jsonp  
})
app.get('/about/user',(req,res)=>{
  // res.send("This is user page")
  // to redirect to another route
  //  res.redirect( '/');
   
})
app.get('/about/user/:userid',(req,res)=>{// for passing id
  res.send(req.params)
})
// for passing multiple ids
app.get('/about/:userid-:bookid',(req,res)=>{
  res.send(req.params)
})
// http://localhost:4000/search?name=akash&age=20 for search or query params
app.get('/search', (req, res) => {
  const name =req.query.name
  const age= req.query.age
  res.send(`search reasult: name->${name} Age-> ${age}`); 
});

// ! to use EJS template engine 
app.get('/ejsexample', (req, res) => {
  render
});
app.set('name', 'value');