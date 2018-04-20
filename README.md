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

### getContent(callback(:content))

Gets the block's current content and passes it into the callback function.

#### Parameters

Name | Type | Description | Required
--- | --- | --- | ---
callback(:content) | function | Receives the current content stored in the block (string) |

#### Notes

* This is the content which will be sent in the final message.

### setContent(content, callback(:newContent))

Sets the block's content. The updated content is passed into a callback function.

#### Parameters

Name | Type | Description | Required
--- | --- | --- | ---
content | string | The requested content with which the block should be set | X
callback(:newContent) | function | Receives the content stored in the block (string) |

#### Notes

* The content passed into the callback will not necessarily match the content passed as the first parameter. There is some processing that happens to remove potentially malicious content and to correct HTML. Always ensure that the callback's content is used for the source of truth for the current content rather than the content passed.

### setSuperContent(superContent, callback(:newSuperContent))

Sets the block's visible preview content.

#### Parameters

Name | Type | Description | Required
--- | --- | --- | ---
superContent | string | The requested preview content with which the block should be set | X
callback(:newSuperContent) | function | Receives the content stored in the block (string) |

#### Notes

* Super content is used for preview purposes only. It allows the block to show the user a representation of the block in the preview, in case the content being set contains AMPscript, GTL, or anything else that isn't pure HTML and wouldn't look nice in the preview.
* Similar to setContent, the content passed to the callback might not necessarily match the superContent passed in due to block processing. This is less of a concern because super content should never be used for consumed by the custom block. It should only ever set. Hence the lack of support for getSuperContent.

### getData(callback(:dataObject))

Gets the custom block's metadata and passes it into a callback function.

#### Parameters

Name | Type | Description | Required
--- | --- | --- | ---
callback(:data) | function | Receives the current metadata stored in the block (object) |

#### Notes

* The metadata should be used as the custom block's way to retain state.
* It must be a JSON serializable object.

### setData(dataObject, callback(:dataObject))

Sets the block's metadata. The updated data object is passed into a callback function.

#### Parameters

Name | Type | Description | Required
--- | --- | --- | ---
dataObject | object | The requested metadata with which the block should be set | X
callback(:data) | function | Receives the new metadata stored in the block (object) |

#### Notes

* This will always overwrite the entire metadata. Any partial data object can cause data loss. Be sure to always extend your current metadata to have a full data object before passing to setData

### Example

```javascript
var sdk = new window.sfdc.BlockSDK();
sdk.getContent(function (content) {
  content += '.';
  sdk.setContent(content, function (setContent) {
    // block content is now its original content + '.'
  });
});
```
