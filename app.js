//#express require
const express = require("express")

//create an object of express
const app = express();
const path = require("path");

//load env file.. using process
require("dotenv").config()

const cors = require("cors")

app.use(express.json()) //it will accept json data..
app.use(cors()) //allow all requests

//DB Connection
const DBConnection = require("./src/utils/DBConnection")
DBConnection()

//Routes
const userRoutes = require("./src/routes/UserRoutes")
app.use("/user",userRoutes)

const ServiceRoutes = require("./src/routes/ServiceRoutes")
app.use("/service",ServiceRoutes)

const providerRoutes = require("./src/routes/providerRoutes")
app.use("/provider",providerRoutes)

const providerServiceRoutes = require("./src/routes/ProviderServiceRoutes")
app.use("/provider-service",providerServiceRoutes)

const bookingRoutes = require("./src/routes/BookingRoutes")
app.use("/booking",bookingRoutes)

const paymentRoutes = require("./src/routes/PaymentRoutes")
app.use("/payment",paymentRoutes)


app.use("/uploads", express.static("uploads"));

//server creation
const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`)
})
