import 'reflect-metadata';
import { Request, Response } from 'express';
import { controller, get, post } from '../decorator';
import { getResponseData } from '../utils/util';

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}

@controller('/')
export class LoginController {
  static isLogin(req: BodyRequest): boolean {
    return req.session ? req.session.login : false;
  }

  @post('/login')
  login(req: BodyRequest, res: Response): void {
    const isLogin = LoginController.isLogin(req);
    if (isLogin) {
      res.json(getResponseData('已登入'));
    } else {
      const { password } = req.body;
      if (password === '123' && req.session) {
        req.session.login = true;
        res.json(getResponseData('登入成功'));
      } else {
        res.json(getResponseData('登入失敗', '登入失敗'));
      }
    }
  }

  @get('/logout')
  logout(req: BodyRequest, res: Response): void {
    if (req.session) {
      req.session.login = undefined;
    }
    res.json(getResponseData('已登出'));
  }

  @get('/')
  home(req: BodyRequest, res: Response): void {
    const isLogin = LoginController.isLogin(req);
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
  }
}
