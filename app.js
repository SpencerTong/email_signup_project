const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();

app.use(express.static("public")); 
app.use(bodyParser.urlencoded({extended: true}));


app.listen(process.env.PORT||3000, function(){
  console.log("Server is up and running on port 3000!");
});

app.get('/', function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req, res){
  const first = req.body.firstName;
  const last = req.body.lastName;
  const email = req.body.email;
  
  //data is the object with preset properties/format that mailchimp server expects to get
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: first, //fname and lname are presets which can be changed through mailchimp acc.
          LNAME: last
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data); //later, we use a constant to write this object and send to mailchimps
  const url = "https://us10.api.mailchimp.com/3.0/lists/56554e6346";

  //options is an object specified in doc. of https.request
  //https://nodejs.org/api/https.html#httpsrequestoptions-callback

  const options = {
    method: "POST",
    auth: "spencer1:f192f7f08a13274c5c880b81c188a765-us10"
    //mailchimps specifies we authenticate by anystring: api key, and we see the html options
  };

  //in documentation for https request, we see we must save data we get back in a constant
  //we are making a request to mailchimps server with https.request
  const request = https.request(url, options, function(response){

    if (response.statusCode==200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect('/');
});


//then, we can use that constant to send things over to the mailchimps server using request.write


//api key
//f192f7f08a13274c5c880b81c188a765-us10

//list/audience id
//56554e6346