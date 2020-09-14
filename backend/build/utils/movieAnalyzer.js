"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var MovieAnalyzer = /** @class */ (function () {
    function MovieAnalyzer() {
    }
    MovieAnalyzer.getInstance = function () {
        if (!MovieAnalyzer.instance) {
            MovieAnalyzer.instance = new MovieAnalyzer();
        }
        return MovieAnalyzer.instance;
    };
    MovieAnalyzer.prototype.getMovieInfo = function (html) {
        var $ = cheerio_1.default.load(html);
        var releaseInfo = $('.release_info');
        var info = [];
        releaseInfo.map(function (index, element) {
            var name = $(element).find('.release_movie_name').find('a').eq(0).text().trim();
            var level = $(element).find('.leveltext').find('span').eq(0).text().trim();
            info.push({ name: name, level: level });
        });
        return {
            time: new Date().getTime(),
            data: info,
        };
    };
    MovieAnalyzer.prototype.generateJsonContent = function (filePath, movieInfo) {
        var fileContent = {};
        // if (fs.existsSync(filePath)) {
        //   fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        // }
        fileContent[movieInfo.time] = movieInfo.data;
        return fileContent;
    };
    MovieAnalyzer.prototype.analyze = function (html, filePath) {
        var movieInfo = this.getMovieInfo(html);
        var content = this.generateJsonContent(filePath, movieInfo);
        return JSON.stringify(content);
    };
    return MovieAnalyzer;
}());
exports.default = MovieAnalyzer;
