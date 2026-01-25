const express = require("express");
const app = express();
const ejsmate = require("ejs-mate");
const fetch = require("node-fetch");  // to parse api data.
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { cometData } = require("./data/cometData");
const { planetData } = require("./data/planetData");
const { starData } = require("./data/startData");

const path = require("path");  //to seerver static file.

const port = 3000;

app.engine("ejs" ,ejsmate);              //All .ejs files are rendered using ejs-mate
app.set("view engine","ejs");            //using EJS as template engine
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));  //  Serve public folder first

app.get("/",(req,res)=>{
  res.render("home.ejs" , { route: "/" });
});

app.get("/apod",async (req,res,next)=>{
  let apiKey = process.env.NASA_API_KEY;
  const apiurl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
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

app.get("/login",(req,res)=>{
  res.render("login.ejs");
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});


app.get("/knowmore/:category/:id", (req, res,next) => {
  // console.log(req.params);
  let { id , category } = req.params;
  // console.log("REQ PARAMS:", req.params);

  //dataset selection
  let dataset;
  if (category === "planets") dataset = planetData;
  else if (category === "comets") dataset = cometData;
  else if (category === "stars") dataset = starData;
  else {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }
  // console.log(dataset);
  const info = dataset.find(item => item.id === id.toString()); // ensure string
  // console.log(info);
  if (!info) {
    const err = new Error(`${category.slice(0, -1)} not found`); // removes plural
    err.status = 404;
    return next(err);
  }

  res.render("knowmore.ejs", { info });
});

// app.get('/favicon.ico', (req, res) => res.status(204).end());


app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(err.status || 500).render("error.ejs", {
    message: err.message
  });
});



app.listen(port, () => {
  console.log(`server is listing on port : ${port}`);
})