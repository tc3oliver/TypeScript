import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import './controller/LoginController';
import './controller/CrawlerController'
import { router } from './router';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: 'session',
    keys: ['secret keys'],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
app.use(router);

app.listen(7000, () => {
  console.log('server is runnung.');
});
