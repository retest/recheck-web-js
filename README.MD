# getElementByPath

## Installation

```
npm i recheck-web-js
```

## Usage

### TypeScript / es6

```js
import { mapElement } from "recheck-web-js";

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