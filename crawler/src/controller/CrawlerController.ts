import fs from 'fs';
import path from 'path';
import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { controller, get, use } from '../decorator';
import { getResponseData } from '../utils/util';
import MovieAnalyzer from '../utils/movieAnalyzer';
import Crawler from '../utils/crawler';

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}

const checkLogin = (req: Request, res: Response, next: NextFunction): void => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, '請先登入'));
  }
};

@controller('/')
export class CrawlerController {
  @get('/getData')
  @use(checkLogin)
  getData(req: BodyRequest, res: Response): void {
    const url = 'https://movies.yahoo.com.tw/movie_thisweek.html';
    const movieAnalyzer = MovieAnalyzer.getInstance();
    new Crawler(url, movieAnalyzer);
    res.json(getResponseData('執行爬蟲成功'));
  }

  @get('/showData')
  @use(checkLogin)
  showData(req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, '../../data/movie.json');
      const result = fs.readFileSync(position, 'utf8');
      res.json(getResponseData(JSON.parse(result)));
    } catch (e) {
      res.json(getResponseData(JSON.parse('{}'), '還沒有資料'));
    }
  }
}
