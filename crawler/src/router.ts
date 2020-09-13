import fs from 'fs';
import path from 'path';
import { Router, Request, Response, NextFunction } from 'express';
import MovieAnalyzer from './utils/movieAnalyzer';
import Crawler from './utils/crawler';
import {getResponseData} from './utils/util'

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, '請先登入'))
  }
};

const router = Router();

router.get('/', (req: BodyRequest, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.send(`
      <html>
      <body>
      <a href='/showData'>查看</a>
      <a href='/getData'>執行爬蟲</a>
      <a href='/logout'>登出</a>
      </body>
      </html>
  `);
  } else {
    res.send(`
      <html>
      <body>
        <form method="POST" action="/login">
        <input type="password" name="password">
        <button>sent</button>
        </form>
      </body>
      </html>
  `);
  }
});

router.get('/logout', (req: BodyRequest, res: Response) => {
  if (req.session) {
    req.session.login = undefined;
  }
  res.json(getResponseData("已登出"))
});

router.post('/login', (req: BodyRequest, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.json(getResponseData('已登入'))
  } else {
    const { password } = req.body;
    if (password === '123' && req.session) {
      req.session.login = true;
      res.json(getResponseData('登入成功'))
    } else {
      res.json(getResponseData('登入失敗', '登入失敗'))
    }
  }
});

router.get('/getData', checkLogin, (req: BodyRequest, res: Response) => {
  const url = 'https://movies.yahoo.com.tw/movie_thisweek.html';
    const movieAnalyzer = MovieAnalyzer.getInstance();
    new Crawler(url, movieAnalyzer);
    res.json(getResponseData('執行爬蟲成功'))
});

router.get('/showData', checkLogin, (req: BodyRequest, res: Response) => {
  try {
    const position = path.resolve(__dirname, '../data/movie.json');
    const result = fs.readFileSync(position, 'utf8');
    res.json(getResponseData(JSON.parse(result)))
  } catch (e) {
    res.json(getResponseData(JSON.parse('{}'), "還沒有資料"))
  }
});

export default router;
