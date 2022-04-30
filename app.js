const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const port = 3000;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb+srv://pranaavs2003:pranaavs2003@cluster0.qur1o.mongodb.net/RentSetGO", {useNewUrlParser: true});


//Database code

//User Login Credentials
const userSchema = new mongoose.Schema({
  emailID: String,
  password: String,
  registerDateTime: String,
  userType: String
});

const User = new mongoose.model("User", userSchema);

//Form Data
const formSchema = new mongoose.Schema({
  fName: String,
  lName: String,
  emailID: String,
  pNo1: String,
  pNo2: String,
  addressLine1: String,
  addressLine2: String,
  country: String,
  state: String,
  pinCode: String,
  vehicleType: String,
  makeModel: String,
  yearMake: Number,
  vehicleColor: String,
  regNo: String,
});

const Form = new mongoose.model("Form", formSchema);

//Rented cars
const rentedSchema = new mongoose.Schema({
    regNo: String,
    carType: String,
    makeModel: String,
    color: String,
    status: String,
    customer: {
      fName: String,
      lName: String,
      emailID: String,
      pNo1: String,
      pNo2: String,
      addressLine1: String,
      addressLine2: String,
      country: String,
      state: String,
      pinCode: String
    }
});

const RentedCar = new mongoose.model("RentedCar", rentedSchema);

//Available cars
const availableSchema = new mongoose.Schema({
  regNo: String,
  carType: String,
  makeModel: String,
  color: String,
  phoneNumber: String,
  status: String
});

const AvailableCar = new mongoose.model("AvailableCar", availableSchema);

let availCars = {};
let rentCars = {};
let carClass;

RentedCar.find(function(err, rcars){
  if(err){
    console.log(err);
  }
  else{
    rentCars = rcars;
    //console.log(rcars);
  }
});

AvailableCar.find(function(err, acars){
  if(err){
    console.log(err);
  }
  else{
    availCars = acars;
    //console.log(acars);
  }
});


//Root Route
app.get("/", function(req, res){
  res.render("index");
});



//Login Page Route (get)
app.get("/login",function(req, res){
  res.render("login");

});

//Register Page Route (get)
app.get("/register",function(req, res){
  res.render("register");

});

//Login Page Route (post)
app.post("/login", function(req, res){
  const emailID = req.body.email;
  const password = req.body.password;
  //console.log("Email: ", emailID);
  //console.log("Password: ", password);

  User.findOne({emailID:emailID}, function(err,foundPerson){
    if(err){
      console.log(err);
    }
    else{
      console.log(foundPerson.password);
      if(foundPerson.password === password){
        if(emailID.includes("rentsetgo")){
            res.redirect("/employeeDashboard");
        }
        else{
            res.redirect("/customerDashboard");
        }
      }
      else{
        res.redirect("/login");
      }
    }
  });
});

//Login Page Route (post)
app.post("/register", function(req,res){
  const emailID = req.body.email;
  const password = req.body.password;
  var userType = "";
  const d = new Date();

  console.log(d);
  console.log("Email: ", emailID);
  console.log("Password: ", password);

  if(emailID.includes("rentsetgo")){
      res.redirect("/employeeDashboard");
      userType = "Employee";
  }
  else{
      res.redirect("/customerDashboard");
      userType = "Customer";
  }

  const user1 = new User({
    emailID: emailID,
    password: password,
    registerDateTime: "Today",
    userType: userType
  });

  user1.save()

});





//customerDashboard page Route
app.get("/customerDashboard",function(req, res){
    res.render("customerDashboard");
});

app.get("/orders", function(req, res){
  res.render("orders");
});

app.get("/rental", function(req,res){
  res.render("rentForm");
});

app.get("/customerProfile", function(req, res){
  res.render("customerProfile");
});



// app.get("/confirmation", function(req, res){
//   res.render("confirmation");
// });
//
// app.post("/conformation", function(req, res){
//
// });

app.get("/confirmationSUV", function(req, res){
  res.render("confirmationSUV");
});

app.post("/confirmationSUV", function(req, res){

  const vehicleType = "SUV";
  AvailableCar.findOne({vehicleType:vehicleType}, function(err,foundCar){
    if(err){
      console.log(err);
    }
    else{
      if(foundCar){
        console.log("Car Found");
        console.log(foundCar);

        const rented1 = new RentedCar({
          regNo: foundCar.regNo,
          carType: foundCar.carType,
          makeModel: foundCar.makeModel,
          color: foundCar.color,
          status: "booked",
          customer: {
            fName: req.body.fName,
            lName: req.body.lName,
            emailID: req.body.emailID,
            pNo1: req.body.pNo1,
            pNo2: req.body.pNo2,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            country: req.body.country,
            state: req.body.state,
            pinCode: req.body.pinCode,
          }

        });
        rented1.save();
        res.redirect("/booked");
      }
      else{
        console.log("Car Not Found!");
        res.redirect("/customerDashboard");
        res.redirect("/notbooked");
      }
    }
  });

});

app.get("/confirmationHatch", function(req, res){
  res.render("confirmationHatch");
});

app.post("/conformationHatch", function(req, res){
  const vehicleType = "Hatchback";
  AvailableCar.findOne({vehicleType:vehicleType}, function(err,foundCar){
    if(err){
      console.log(err);
    }
    else{
      if(foundCar){
        console.log("Car Found");
        console.log(foundCar);
        res.redirect("/booked");
      }
      else{
        console.log("Car Not Found!");
        res.redirect("/customerDashboard");
        res.redirect("/notbooked");
      }
    }
  });
});

app.get("/confirmationSedan", function(req, res){
  res.render("confirmationSedan");
});

app.post("/conformationSedan", function(req, res){
  const vehicleType = "Sedan";
  AvailableCar.findOne({vehicleType:vehicleType}, function(err,foundCar){
    if(err){
      console.log(err);
    }
    else{
      if(foundCar){
        console.log("Car Found");
        console.log(foundCar);
        res.redirect("/booked");
      }
      else{
        console.log("Car Not Found!");
        res.redirect("/customerDashboard");
        res.redirect("/notbooked");
      }
    }
  });
});

//employeeDashboard Page Route
app.get("/employeeDashboard",function(req, res){
    res.render("employeeDashboard", {
      rentCar: rentCars,
      availCars: availCars
    });
});

app.get("/employeeProfile", function(req, res){
  res.render("employeeProfile");
});


//Rental form
app.get("/rentForm", function(req, res){
    res.render("rentForm");
});

app.post("/rentForm", function(req, res){
    // const firstName = req.body.fName;
    // const lastName = req.body.lName;
    // const emailID = req.body.emailID;
    // const phoneNumber1 = req.body.pNo1;
    // const phoneNumber2 = req.body.pNo2;
    // const address1 = req.body.addressLine1;
    // const address2 = req.body.addressLine2;
    // const country = req.body.country;
    // const state = req.body.state;
    // const pinCode = req.body.pinCode;
    // const vehicleType = req.body.vehicleType;
    // const makeModel = req.body.makeModel;
    // const yearMake = req.body.yearMake;
    // const vehicleColor = req.body.vehicleColor;
    // const regNo = req.body.regNo;

    const form1 = new Form({
      fName: req.body.fName,
      lName: req.body.lName,
      emailID: req.body.emailID,
      pNo1: req.body.pNo1,
      pNo2: req.body.pNo2,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      country: req.body.country,
      state: req.body.state,
      pinCode: req.body.pinCode,
      vehicleType: req.body.vehicleType,
      makeModel: req.body.makeModel,
      yearMake: req.body.yearMake,
      vehicleColor: req.body.vehicleColor,
      regNo: req.body.regNo
    });

    form1.save();

    const availableCar1 = new AvailableCar({
      emailID: req.body.emailID,
      pNo1: req.body.pNo1,
      pNo2: req.body.pNo2,
      vehicleType: req.body.vehicleType,
      makeModel: req.body.makeModel,
      yearMake: req.body.yearMake,
      vehicleColor: req.body.vehicleColor,
      regNo: req.body.regNo
    });

    availableCar1.save();

    console.log("Form Successfully Submitted.");

    res.redirect("/customerDashboard");
});

//Index Sub-Routes

//About Us Page
app.get("/about", function(req, res){
    res.render("about");
    //res.sendFile(__dirname+"/public/about.html");
});


//Pricing
app.get("/pricing", function(req, res){
    res.render("pricing");
    //res.sendFile(__dirname+"/public/pricing.html");
});


//FAQs
app.get("/faq", function(req, res){
    res.render("faq");
    //res.sendFile(__dirname+"/public/faq.html");
});


//Success
app.get("/success", function(req, res){
    res.render("success");
    //setTimeout(() => { res.redirect("/customerDashboard"); }, 2000);
    //res.redirect("/customerDashboard");
});
app.post("/success", function(req, res){
  setTimeout(() => { res.redirect("/customerDashboard"); }, 1000);
});


//Booked and Not Booked
app.get("/booked", function(req, res){
  res.render("booked");
});
app.post("/booked", function(req, res){
  res.redirect("customerDashboard");
});

app.get("/notbooked", function(req, res){
  res.render("notbooked");
});
app.post("/notbooked", function(req, res){
  res.redirect("customerDashboard");
});

//View More
app.get("/viewmore", function(req, res){
    res.render("viewmore");
});
app.get("/checkout", function(req, res){
    res.render("checkout");
});

//mongoose.connection.close()


//Server Listening
app.listen(port, function(req, res){
  console.log("Server listening in port 3000...");
});
