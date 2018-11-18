# Angular + NestJS 


### Development

* Development port is on: 4200 ( inherited from angular-cli )

**in development, every controller ( route ) from NestJS must be mapped in proxy.conf.json**

```bash
npm start
```

### Production

* Production port is specified in .env ( default to 5400 )

```bash
npm run build:universal
```

after build:
copy .env
run make-symlink.bat

```bash
node dist/server.js
```