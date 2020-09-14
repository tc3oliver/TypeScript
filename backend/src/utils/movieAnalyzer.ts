import fs from 'fs';
import cheerio from 'cheerio';
import { Analyzer } from './crawler';

interface Movie {
  name: string;
  level: string;
}

interface MovieInfo {
  time: number;
  data: Movie[];
}

interface Content {
  [propName: number]: Movie[];
}

export default class MovieAnalyzer implements Analyzer {
  private static instance: MovieAnalyzer;

  public static getInstance() {
    if (!MovieAnalyzer.instance) {
      MovieAnalyzer.instance = new MovieAnalyzer();
    }
    return MovieAnalyzer.instance;
  }

  private constructor() {}

  private getMovieInfo(html: string) {
    const $ = cheerio.load(html);
    const releaseInfo = $('.release_info');
    const info: Movie[] = [];

    releaseInfo.map((index, element) => {
      const name = $(element).find('.release_movie_name').find('a').eq(0).text().trim();
      const level = $(element).find('.leveltext').find('span').eq(0).text().trim();

      info.push({ name, level });
    });

    return {
      time: new Date().getTime(),
      data: info,
    };
  }

  private generateJsonContent(filePath: string, movieInfo: MovieInfo) {
    let fileContent: Content = {};

    // if (fs.existsSync(filePath)) {
    //   fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    // }
    fileContent[movieInfo.time] = movieInfo.data;
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const movieInfo = this.getMovieInfo(html);
    const content = this.generateJsonContent(filePath, movieInfo);
    return JSON.stringify(content);
  }
}
