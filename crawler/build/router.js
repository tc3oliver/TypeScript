"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var express_1 = require("express");
var movieAnalyzer_1 = __importDefault(require("./utils/movieAnalyzer"));
var crawler_1 = __importDefault(require("./utils/crawler"));
var util_1 = require("./utils/util");
var checkLogin = function (req, res, next) {
    var isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        next();
    }
    else {
        res.json(util_1.getResponseData(null, '請先登入'));
    }
};
var router = express_1.Router();
router.get('/', function (req, res) {
    var isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        res.send("\n      <html>\n      <body>\n      <a href='/showData'>\u67E5\u770B</a>\n      <a href='/getData'>\u57F7\u884C\u722C\u87F2</a>\n      <a href='/logout'>\u767B\u51FA</a>\n      </body>\n      </html>\n  ");
    }
    else {
        res.send("\n      <html>\n      <body>\n        <form method=\"POST\" action=\"/login\">\n        <input type=\"password\" name=\"password\">\n        <button>sent</button>\n        </form>\n      </body>\n      </html>\n  ");
    }
});
router.get('/logout', function (req, res) {
    if (req.session) {
        req.session.login = undefined;
    }
    res.json(util_1.getResponseData("已登出"));
});
router.post('/login', function (req, res) {
    var isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        res.json(util_1.getResponseData('已登入'));
    }
    else {
        var password = req.body.password;
        if (password === '123' && req.session) {
            req.session.login = true;
            res.json(util_1.getResponseData('登入成功'));
        }
        else {
            res.json(util_1.getResponseData('登入失敗', '登入失敗'));
        }
    }
});
router.get('/getData', checkLogin, function (req, res) {
    var url = 'https://movies.yahoo.com.tw/movie_thisweek.html';
    var movieAnalyzer = movieAnalyzer_1.default.getInstance();
    new crawler_1.default(url, movieAnalyzer);
    res.json(util_1.getResponseData('執行爬蟲成功'));
});
router.get('/showData', checkLogin, function (req, res) {
    try {
        var position = path_1.default.resolve(__dirname, '../data/movie.json');
        var result = fs_1.default.readFileSync(position, 'utf8');
        res.json(util_1.getResponseData(JSON.parse(result)));
    }
    catch (e) {
        res.json(util_1.getResponseData(JSON.parse('{}'), "還沒有資料"));
    }
});
exports.default = router;
