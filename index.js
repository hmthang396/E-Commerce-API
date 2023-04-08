const express = require("express");
const dotenv = require("dotenv")
const bodyParser = require("body-parser");
const session = require("express-session");
const database = require("./src/models/index");
const path = require("path");
const cors = require('cors');
const Authentication = require('./src/middleware/Authentication');
const Authorization = require('./src/middleware/Authorization');
// Config DotENV
dotenv.config();
//Connection to Database MSSQL
(async () => {
    try {
        await database.sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await database.sequelize.sync();
    } catch (error) {
        console.error(error);
    }
})();
// Config Server
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: "somesecret",
        cookie: {},
    })
);

app.use(express.static(path.join(__dirname, "./src/public")));

// Config Route

app.use("/api/server/product", Authentication, require('./src/routes/server/Product.route'));
app.use("/api/server/color", Authentication, require('./src/routes/server/Color.route'));
app.use("/api/server/image", Authentication, require('./src/routes/server/Image.route'));
app.use("/api/server/category", Authentication, require('./src/routes/server/Category.route'));
app.use("/api/server/subcategory", Authentication, require('./src/routes/server/SubCategory.route'));
app.use("/api/server/brand", Authentication, require('./src/routes/server/Brand.route'));
app.use("/api/server/discount", Authentication, require('./src/routes/server/Discount.route'));
app.use("/api/server/collection", Authentication, require('./src/routes/server/Collection.route'));
app.use("/api/server/account",Authentication, Authorization.isAdministrator, require('./src/routes/server/Account.route'));
app.use("/api/server/login", require('./src/routes/server/Login.route'));
app.use("/api/server/order", Authentication, require('./src/routes/server/Order.route'));
app.use("/api/server/transaction", Authentication, require('./src/routes/server/Transaction.route'));
app.use("/api/server/dashboard", Authentication, require('./src/routes/server/Dashboard.route'));

app.use("/api/client/product", require('./src/routes/client/Product.route'));
app.use("/api/client/order", require('./src/routes/client/Order.route'));
app.use("/api/client/user", require('./src/routes/client/User.route'));
app.use("/api/client/brand", require('./src/routes/client/Brand.route'));
app.use("/api/client/category", require('./src/routes/client/Category.route'));
app.use("/api/client/comment", require('./src/routes/client/Comment.route'));
app.use("/api/client/like", require('./src/routes/client/Like.route'));
app.use('/api/client/oauth', require('./src/routes/client/OAuth.route'));
// Error Handling Middleware called

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    return res.status(error.status || 400).send({
        Data: null,
        ErrorCode: error.status || 400,
        Message: error.message || 'Internal Server Error',
    });
});

// End-Route

// Config PORT Server
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, console.log(`Server Started on PORT ${PORT}`));