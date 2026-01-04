const express = require("express");
const app = express();
const ejsmate = require("ejs-mate");
const fetch = require("node-fetch");  // to parse api data   or we can use axios.

const { cometData } = require("./data/cometData");
const { planetData } = require("./data/planetData");
const { starData } = require("./data/startData");

const path = require("path");  //to seerver static file.

const port = 3000;

app.engine("ejs" ,ejsmate);              //All .ejs files are rendered using ejs-mate
app.set("view engine","ejs");            //using EJS as template engine
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
  res.render("home.ejs" , { route: "/" });
});

app.get("/apod",async (req,res,next)=>{
  const apiurl = "https://api.nasa.gov/planetary/apod?api_key=I7gvHZ7EFKsGyBDWjkpvoRiNUW2X2u5Aq3dqc7nh";
  try {
    const response = await fetch(apiurl);
    if (!response.ok) {
      throw new Error(`NASA API failed with status ${response.status}`);
    }

    const text = await response.text(); // safer than json()

    if (!text) {
      throw new Error("Empty response from NASA API");
    }
    const data = JSON.parse(text);

    if (!data.url && data.thumbnail_url) {
      data.url = data.thumbnail_url;
    }
    // const data = await response.json();
    // if(!data.url){
    //   data.url = data.thumbnail_url;
    // }
    res.render("apod.ejs",{data});
    // console.log("Content object:", data);
  } catch (err) {
    next(err);
  } 
});

app.get("/comets",(req,res)=>{
  res.render("comet.ejs" , { cometData });
});
app.get("/planets",(req,res)=>{
  res.render("planet.ejs" , { planetData });
});
app.get("/stars",(req,res)=>{
  res.render("star.ejs" , { starData });
});




// Global error handler (LAST)
// app.use((err,req,res,next)=>{
//   let { statusCode = 500, message = " Globally Something went wrong" } = err;
//   res.status(statusCode).render(message);
// });
app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(500).render("error.ejs", {
    message: err.message
  });
});



app.listen(port, () => {
  console.log(`server is listing on port : ${port}`);
})