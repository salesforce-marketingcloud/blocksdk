
# Salesforce Marketing Cloud Content Builder Block SDK

## Introduction

Use this SDK to simplify third-party block development for Salesforce Marketing Cloud Content Builder. The SDK provides domain validation and simple method calls that wrap the cross-document messaging the editor uses to communicate with third-party blocks.

## Installation

The SDK can be used as a simple script tag or pulled in as a node module.

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

## Initialization Options

- blockEditorWidth
  - Type: `String|Number`
  - Default: `undefined`
  - Set the available width for the block editor.  The editor may restrict the available values.
- tabs
  - Type: `Array`
  - Default: `['stylingblock', 'htmlblock']`
  - Required: `false`
  - The editor displays the Content tab and any specified tabs. If an empty array is passed, only the Content tab appears.
  - See [CustomTabs](#custom-tabs) for documentation.

### Initialization Sample
```
this.sdk = new BlockSDK({
           blockEditorWidth: 600,
           tabs: [
               { key: 'design', url: `${window.location.origin}/block/design/`, name: 'Design' }, // This is a custom tab
               'htmlblock', // This is the HTML Editor Tab
               'stylingblock' // This is the styling tab
           ]
       }
```
## Usage

Once you have an instantiated SDK, use these available methods:

### getContent(callback(:content))

Gets the block's current content and passes it into the callback function.

#### Parameters

Name | Type | Description | Required
--- | --- | --- | ---
callback(:content) | function | Receives the current content string stored in the block | no

#### Notes

* This is the content which will be sent in the final message.

### setContent(content, callback(:newContent))

Sets the block's content. The updated content is passed into a callback function.

#### Parameters

Name | Type | Description | Required
--- | --- | --- | ---
content | string | Receives the content string stored in the block | yes
callback(:newContent) | function | Receives the content stored in the block (string) | No

#### Notes

* The content passed into the callback will not necessarily match the content passed as the first parameter. There is some processing that happens to remove potentially malicious content and to correct HTML. Always use the callback’s content as the source of truth for the current content rather than the content passed.

### setSuperContent(superContent, callback(:newSuperContent))

Sets the block's visible preview content.

#### Parameters

Name | Type | Description | Required
--- | --- | --- | ---
superContent | string | The requested preview content set and stored in the block  | X
callback(:newSuperContent) | function | Receives the content stored in the block (string) |

#### Notes

* Super content is only used to preview content. Super content is realistic content only used when editing and is ignored once the asset is published. If the set content contains AMPscript, GTL, or other non-HTML code that can render poorly, use super content to preview the rendering.
* Similar to setContent, the content passed to the callback doesn’t always match the superContent passed due to block processing.  This is less of a concern because super content is only to be set and never consumed by the custom block. Super content is not supported when used with blocks.

### getData(callback(:dataObject))

Gets the custom block's metadata and passes it into a callback function.

#### Parameters

Name | Type | Description | Required
--- | --- | --- | ---
callback(:data) | function | Receives the current object metadata stored in the block |

#### Notes

* Always use the metadata as the custom block's way to retain state.
* Always use a JSON serializable object.

### setData(dataObject, callback(:dataObject))

Sets the block's metadata. The updated data object is passed into a callback function.

#### Parameters

Name | Type | Description | Required
--- | --- | --- | ---
dataObject | object | The requested metadata with which the block should be set | X
callback(:data) | function | Receives the new metadata stored in the block (object) |

#### Notes

* This method always overwrites all metadata. Any partial data object can cause data loss. Always extend your current metadata to have a full data object before passing to setData.

### getUserData(callback(:dataObject))

Gets some context for the currently authenticated user. The updated data object is passed into a callback function.

#### Parameters

Name | Type | Description | Required
--- | --- | --- | ---
callback(:data) | function | Receives some object data about the currently authenticated user  (object) |

#### Notes

* The object argument of the callback contains a `stack` and `locale` property.

### setBlockEditorWidth(width, callback())

Sets the width of the current block.

#### Parameters

Name | Type | Description | Required
--- | --- | --- | ---
width | `number` or `string` | The block width. Can be specified as a number, or a string like `500px` | X
callback() | function | Called once the block expands to the specified width |

#### Notes

* Ensure that width is greater than 425 px and less than 850 px. Percentage widths are not supported.
* The width does not persist anywhere. To always retain a 500 px block width, set the width each time the block is opened.


### triggerAuth(appID)

Opens a hidden iframe to the SSO page for the appID provided. This passes a JWT to the block’s server-side login URL, the login URL for the appID, so it can request a token.

#### Parameters

Name | Type | Description | Required
--- | --- | --- | ---
appID | `string` | The installed package ID or appExchange appID in alphanum xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx `string` format | X

### triggerAuth2({authURL: authURL, clientId: clientId, redirectURL: redirectURL})

Opens a hidden iframe to the OAuth2 page for the authURL provided. Passes an OAuth2 code to the block’s server-side redirect URL so it can request a token.

#### Parameters

Name | Type | Description | Required
--- | --- | --- | ---
authURL | `string` | The enhanced package authURL (auth_uri) in `string` format | X
clientId | `string` | The enhanced package clientId (client_id) in `string` format | X
redirectURL | `string` | The enhanced package redirectURL (redirect_uri) in `string` format | X
scope | `string` array | An array of permissions being requested in [`string`, `string`] format |

## Example

```javascript
var sdk = new window.sfdc.BlockSDK();
sdk.getContent(function (content) {
  content += '.';
  sdk.setContent(content, function (setContent) {
    // block content is now its original content + '.'
  });
});
```

## Custom Tabs

Custom tabs let you control which tabs the Content Builder editor loads for the custom block.

>If you declare a custom tab, the block also displays the Content tab but not the HTML and Block Settings tabs. To display those tabs, declare `htmlblock` and `stylingblock` in your custom tab code.

The tabs array can be a mix of both `string` and `object` types. The possible string values
are `stylingblock` and `htmlblock`. Ensure that the `object` values provide these three values:
- `key`
    - Type: `string`
    - This is a unique identifier for the tab, and should be different for every custom tab a block defines.
    - Ex: `my-custom-tab`
- `name`
    - Type: `string` or `object`
    - The name of the tab. If no localization is required, provide a string. If localization is required, provide an `object` with key value pairs of the culture code and localized value. If the object doesn’t contain the user’s locale, Content Builder tries to use the en-US fallback, then uses the first value provided.
    - Ex: `My Custom Tab` or `{'en-US': 'English Name', 'fr': 'French Name'}`
- `url`
    - Type: `string`
    - The URL of the custom block to load. Ensure that the URL is similar to the URL entered in Installed Packages
    - Example: `https://localhost:3000/customtab`

#### Examples:
Content tab, Block Style tab
```
['stylingblock']
```

Content tab only
```
[]
```

Content tab, custom tab named 'My Custom Tab'
```
[{
    name: 'My Custom Tab',
    key: 'customtab',
    url: 'https://localhost:3000/customtab'
}]
```

Content tab, custom tab named 'My Custom Tab', Block Style tab, HTML tab
```
[{
    name: 'My Custom Tab',
    key: 'customtab',
    url: 'https://localhost:3000/customtab'
}, 'stylingblock', 'htmlblock']
```


Content tab, custom tab with different names depending on the user's language
```
[{
    name: {
        'en-US': 'English Name',
        'fr': 'French Name'
    },
    key: 'localized-tab',
    url: 'https://localhost:3000/customtab'
}]
```
