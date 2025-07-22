console.log("hello");

const express = require('express');
const app = express()

// Start the server .listen starts the server
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
})

app.get('/',(req,res)=>{
    res.send("Hello Express")
})