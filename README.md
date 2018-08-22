# Angular NestJS Universal ( Server Rendering )

- src/client <-- Angular 5+
- src/server <-- NestJS
- src/shared <-- Shared between apps
  
### Install

```bash
npm install
```

### Development

* Development port is on: 4200 ( inherited from angular-cli )

**in development, every controller ( route ) from NestJS must be mapped in proxy.conf.json**

```bash
npm start
```

Don't forget to Lint and Prettify your code from time to time:

```bash

npm run client:lint
npm run server:lint

npm run prettify

```


### Production

* Production port is specified in .env ( default to 5400 )

