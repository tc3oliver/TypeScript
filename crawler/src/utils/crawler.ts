import fs from 'fs';
import path from 'path';
import superagent from 'superagent';

export interface Analyzer {
  analyze(html: string, filePath: string): string;
}

export default class Crawler {
  private filePath = path.resolve(__dirname, '../../data/movie.json');

  private async rawHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  }

  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  private async init() {
    const html = await this.rawHtml();
    const content = this.analyer.analyze(html, this.filePath);
    this.writeFile(content);
  }

  constructor(private url: string, private analyer: Analyzer) {
    this.init();
  }
}