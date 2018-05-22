const express = require('express');
const config = require('./config/index');

let port = process.env.PORT || config.build.port;

const app = express();
const router = express.Router();


router.get('/', (req, res, next) => {
    req.url = '/index.html';
    next();
});
app.use(router);

const appData = require('./data.json');
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

var apiRoutes = express.Router();

app.get('/api', (req, res) => {
    res.json({
        errno: 0,
        data: appData
    })
});
app.get('/api/seller', (req, res) => {
    res.json({
        errno: 0,
        data: seller
    })
});
app.get('/api/goods', (req, res) => {
    res.json({
        errno: 0,
        data: goods
    })
});
app.get('/api/ratings', (req, res) => {
    res.json({
        errno: 0,
        data: ratings
    })
});
app.use('/api', apiRoutes);
app.use(express.static('./dist'));
module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err);
        return
    }
    console.log('Listening at http://localhost:' + port + '\n')
});