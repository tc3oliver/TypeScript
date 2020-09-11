import fs from 'fs';
import cheerio from 'cheerio';
import { Analyer } from './crawler';

interface Movie {
  name: string;
  movieTime: string;
}

interface MovieInfo {
  time: number;
  data: Movie[];
}

interface Content {
  [propName: number]: Movie[];
}

export default class MovieAnalyzer implements Analyer {
  private getMovieInfo(html: string) {
    const $ = cheerio.load(html);
    const releaseInfo = $('.release_info');
    const info: Movie[] = [];

    releaseInfo.map((index, element) => {
      const name = $(element)
        .find('.release_movie_name')
        .find('a')
        .eq(0)
        .text()
        .trim();
      const movieTime = $(element)
        .find('.release_movie_time')
        .eq(0)
        .text()
        .split('： ')[1]
        .trim();

      info.push({ name, movieTime });
    });

    return {
      time: new Date().getTime(),
      data: info,
    };
  }

  private generateJsonContent(filePath: string, movieInfo: MovieInfo) {
    let fileContent: Content = {};

    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    fileContent[movieInfo.time] = movieInfo.data;
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const movieInfo = this.getMovieInfo(html);
    const content = this.generateJsonContent(filePath, movieInfo);
    return JSON.stringify(content);
  }
}
