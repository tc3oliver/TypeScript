import 'reflect-metadata';
import { RequestHandler } from 'express';
import { Controller } from '../controller';

export function use(middleware: RequestHandler) {
  return function (target: Controller, key: string) {
    const originMiddlewares = Reflect.getMetadata('middlewares', target, key) || [];
    originMiddlewares.push(middleware);
    Reflect.defineMetadata('middlewares', originMiddlewares, target, key);
  };
}
