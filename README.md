# Salesforce Marketing Cloud Content Builder Editor Block SDK

## Introduction

This SDK is intended to simplify 3rd party block development for the Salesforce Marketing Cloud Content Builder Editor.
It provides domain validation and simple method calls wrapping around the cross-document messaging the editor uses to communicate with 3rd party blocks.

## Installation

The SDK can be used as a simple script tag, or pulled in as a node module.

Tag:

```html
<html>
  <head></head>
  <body>
    <script src="path/to/blocksdk.js"></script>
    <script>
      var sdk = new window.sfdc.BlockSDK();
      // do something with the sdk
    </script>
  </body>
</html>
```
Module:

```node
var SDK = require('blocksdk');
var sdk = new SDK();
// do something with the sdk
```

## Usage

Once you have an instantiated SDK, the following methods are available to you:

* getContent(callback) - callback gets passed a content string
* setContent(contentString, callback) - callback gets passed a confirmation content string
* getData(callback) - callback gets passed an object with custom block metadata
* setData(dataObject, callback) - callback gets passed a confirmation object
* setSupercontent(contentString, callback) - callback gets passed a confirmation superContent string

Example:

```javascript
var sdk = new window.sfdc.BlockSDK();
sdk.getContent(function (content) {
  content += '.';
  sdk.setContent(content, function (setContent) {
    // block content is now its original content + '.'
  });
});
```
