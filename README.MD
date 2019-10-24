# recheck-web-js

This is the JavaScript behind [recheck-web](https://github.com/retest/recheck-web) and the corresponding [Chrome extension](https://github.com/retest/recheck-web-chrome-extension). What it does is collect all attributes of all elements of the rendered DOM. This can then be collected by recheck-web or sent to retest.de. 

## Installation

```sh
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