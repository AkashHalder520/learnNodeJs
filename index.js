console.log("hello");

const express = require('express');
const app = express()
app.use(express.urlencoded({ extended: true }));// for accepting form data

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
//first we net to set the view engine 
// app.set('name', 'value');
app.set('view engine', 'ejs');// we have to define view engine and file type

app.get('/ejsexample', (req, res) => {
  res.render('user')
});
//! to send data in ejs file
app.get('/aboutejs', (req, res) => {
  res.render('user',{title:"",message:"welcome to ejs"})
});

//! send array of object to ejs
app.get('/arrayobj', (req, res) => {
  const users = [
  {
    id: 1,
    name: "Akash Halder",
    email: "akashhalder520@gmail.com",
    isActive: true
  },
  {
    id: 2,
    name: "Priya Sen",
    email: "priya.sen@example.com",
    isActive: false
  },
  {
    id: 3,
    name: "Rahul Das",
    email: "rahul.das@example.com",
    isActive: true
  }
];
  res.render('table',{items:users})
});
//!to save form 
app.get('/form', (req, res) => {
  res.render('form',{name:'',email:''});
});
//! to get the submitted value from ejs
app.post('/submit', (req, res) => {
  const { name, email, password, gender } = req?.body;

  console.log("Form Data Received:");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Password:", password);
  console.log("Gender:", gender);
res.render('form',{name:name,email:email})
  // Send response or render another page
  // res.send(`Thanks ${name}, your form has been submitted!`);
  //to show on the same page
});
//!to download a file 
app.get('/documents',(req,res)=>{
  res.download('./downloadable_Files/Veppy_Documentation.docx','VeppyDocuments.docx')// pathname 2nd parameter downloaded path name
})

//! sendfile will open the file in new tab not force to download as previous one
app.get('/openFile',(req,res)=>{
  res.sendFile(__dirname+'/downloadable_Files/Veppy_Documentation.docx');
})

//! end

app.get('/end', (req, res) => {
  res.write('THis is write')
  res.end()
});

//! to manually send a status 
app.get('/error', (req, res) => {
  res.sendStatus(404)
});

