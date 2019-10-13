# getElementByPath

[![Codeship Status for LLIu33/getElementByPath](https://app.codeship.com/projects/01e2bf20-d022-0137-fb0a-7aa67cca1efd/status?branch=master)](https://app.codeship.com/projects/369210)

## Installation

```
npm i getElementByPath
```

## Usage

### TypeScript / es6

```js
import { mapElement } from "getElementByPath";

var htmlNode = document.getElementsByTagName("html")[0];
var html = transform(htmlNode);
var allElements = mapElement(htmlNode, "//html[1]", {
    "//html[1]" : html
});
console.log(allElements);
```

## Test 
```sh
npm run test
```