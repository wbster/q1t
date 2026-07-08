# Developing q1t

## Requirements

- Node.js `>=18`
- npm

## Local setup

```bash
npm install
```

## Build

```bash
npm run build
```

## Useful scripts

```bash
npm run test
npm run format
npm run docs
```

## Release flow

```bash
npm run build
npm version patch
npm publish --access public
```

