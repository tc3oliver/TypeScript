"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
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
            var name = $(element)
                .find('.release_movie_name')
                .find('a')
                .eq(0)
                .text()
                .trim();
            var movieTime = $(element)
                .find('.release_movie_time')
                .eq(0)
                .text()
                .split('： ')[1]
                .trim();
            info.push({ name: name, movieTime: movieTime });
        });
        return {
            time: new Date().getTime(),
            data: info,
        };
    };
    MovieAnalyzer.prototype.generateJsonContent = function (filePath, movieInfo) {
        var fileContent = {};
        if (fs_1.default.existsSync(filePath)) {
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
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
