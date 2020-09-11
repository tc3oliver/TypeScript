import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import MovieAnalyzer from './movieAnalyzer';

export interface Analyer {
  analyze(html: string, filePath: string): string
}

class Crawler {
  private filePath = path.resolve(__dirname, '../data/movie.json');

  async rawHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  }

  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  async init() {
    const html = await this.rawHtml();
    const content = this.analyer.analyze(html, this.filePath);
    this.writeFile(content);
  }

  constructor(private url: string, private analyer: any) {
    this.init();
  }
}

const url = 'https://movies.yahoo.com.tw/movie_thisweek.html';
const movieAnalyzer = new MovieAnalyzer();
const crawler = new Crawler(url, movieAnalyzer);
