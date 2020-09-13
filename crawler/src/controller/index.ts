import { CrawlerController } from './CrawlerController';
import { LoginController } from './LoginController';

export * from './CrawlerController';
export * from './LoginController';
export type Controller = CrawlerController | LoginController;
