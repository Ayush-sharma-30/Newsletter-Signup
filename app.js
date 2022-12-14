const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));  //to render our static html and css and all other static files, we have to use this line and public is the name of
                                    // folder in which we will keep all the files

app.use(express.urlencoded({extended: true}));

// app is our browser. It is asking for something(get). So we are sending it a page here.
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

// app is our browser. It is sending something(post). So, we are taking it with req parameters and send the information back as res parameter with
// the help of res.send();
app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;


  const data = {
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  console.log(data);
  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/7e6d1353ed";
  const options = {
    method: "POST",
    auth: "ayush1:7bd9c2bcb14a410d7e27e825721e5c4d-us21"
  }

  // https request makes a post request because we are mentioning it in options field. To make a get request using same request method, mentiion
  // get in options field.
  const reques = https.request(url, options, function(response){

    if(response.statusCode==200){
      res.sendFile(__dirname+ "/success.html");
    }else{
      res.sendFile(__dirname+ "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  });

  // we are making a request here to external server.
  reques.write(jsonData);
  reques.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});
// to deploy app on heroku, we have to use process.env.PORT
app.listen(process.env.PORT || 3000, function(){
  console.log("server started");
});
