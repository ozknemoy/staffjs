import {Middleware, NestMiddleware, ExpressMiddleware, RequestMethod} from '@nestjs/common';


export const FRONT_ROUTES: { path: string, method: string, url?: string }[] = <any>[
  {path: '/', method: RequestMethod.GET, url: 'home'},
  {path: '/staff-list', method: RequestMethod.GET, url: 'staff-list'},
  {path: 'test', method: RequestMethod.GET},
];

@Middleware()
export class RouterMiddleware implements NestMiddleware {
  resolve(...args: any[]): ExpressMiddleware {
    return (req, res, next) => {
      const routeObj = FRONT_ROUTES.find(route => route.path === req.route.path);
      console.log('[[',req.route.path,routeObj.url || req.route.path);
      res.render(routeObj.url || req.route.path);
    };
  }
}