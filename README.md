# recheck-web-js

[![Build Status](https://travis-ci.com/retest/recheck-web-js.svg?branch=master)](https://travis-ci.com/retest/recheck-web-js)
[![Latest recheck on Maven Central](https://maven-badges.herokuapp.com/maven-central/org.webjars.npm/recheck-web-js/badge.svg?style=flat)](https://mvnrepository.com/artifact/org.webjars.npm/recheck-web-js)
[![license](https://img.shields.io/badge/license-AGPL-brightgreen.svg)](https://github.com/retest/recheck/blob/master/LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)](https://github.com/retest/recheck-web-js/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
[![code with hearth by retest](https://img.shields.io/badge/%3C%2F%3E%20with%20%E2%99%A5%20by-retest-C1D82F.svg)](https://retest.de/)

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

## Release

The release of npm module and webjar is performed on travis. To trigger a
build update the version in npm files and create a tag with:

```sh
npm version patch && git push --tags
```

If you want to release a `minor` version use:

```sh
npm version minor && git push --tags
```
