declare module "blocksdk" {
  /* This declaration specifies that the class constructor function
   * is the exported object from the file
   */
  export = SDK;

  // Add types used by the SDK class in the namespace.
  namespace SDK {
    export type ContentCallbackFn = (content: string) => void;
    export type DataCallbackFn = (data: any) => void;

    export interface CustomTab {
      key: string;
      name: string;
      url: string;
    }

    export type CustomTabs = string | CustomTab;

    export interface Config {
      onEditClose?: () => void;
      /**
       * Set the available width for the block editor. The editor may restrict the available values.
       */
      blockEditorWidth?: string | number;
      /**
       * The editor displays the Content tab and any specified tabs. If an empty array is passed,
       * only the Content tab appears.
       * See [CustomTabs](https://github.com/salesforce-marketingcloud/blocksdk#custom-tabs) for
       * documentation.
       */
      tabs?: CustomTabs[];
    }

    export interface Auth2Options {
      /**
       * The enhanced package authURL (auth_uri).
       */
      authURL: string;
      /**
       * The enhanced package clientId (client_id).
       */
      clientId: string;
      /**
       * The enhanced package redirectURL (redirect_uri).
       */
      redirectURL: string;
      /**
       * An array of permissions being requested in a string array format.
       */
      scope?: string[];
      /**
       * The state param to be passed to the authorization URL.
       */
      state?: string;
    }
  }

  // Write the module's methods and properties in this class.
  class SDK {
    constructor(
      config?: SDK.Config,
      whitelistOverride?: string[],
      sslOverride?: boolean
    );

    /**
     * Opens a hidden iframe to the SSO page for the appID provided. This passes a JWT to the block’s server-side login URL, the login URL for the appID, so it can request a token.
     * @param authID The installed package ID or appExchange appID in alphanum `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` string format
     */
    triggerAuth(authID: string): void;

    /**
     * Opens a hidden iframe to the OAuth2 page for the authURL provided. Passes an OAuth2 code to the block’s server-side redirect URL so it can request a token.
     * @param options
     */
    triggerAuth2(options: SDK.Auth2Options): void;

    /**
     * Gets the block's current content and passes it into the callback function.
     * @param callback Receives the current content string stored in the block
     */
    getContent(callback: SDK.ContentCallbackFn): void;

    /**
     * Sets the block's content. The updated content is passed into a callback function.
     * @param content The content string to store in the block
     * @param callback Receives the content stored in the block (string)
     */
    setContent(content: string, callback?: SDK.ContentCallbackFn): void;

    /**
     * Sets the block's visible preview content.
     * @param superContent The requested preview content set and stored in the block
     * @param callback Receives the content stored in the block (string)
     */
    setSuperContent(
      superContent: string,
      callback?: SDK.ContentCallbackFn
    ): void;

    /**
     * Gets the custom block's metadata and passes it into a callback function.
     * @param callback Receives the current object metadata stored in the block
     */
    getData(callback: SDK.DataCallbackFn): void;

    /**
     * Sets the block's metadata. The updated data object is passed into a callback function.
     * @param data The requested metadata with which the block should be set
     * @param callback Receives the new metadata stored in the block (object)
     */
    setData(data: any, callback: SDK.DataCallbackFn): void;

    /**
     * Gets some context for the currently authenticated user. The updated data object is passed into a callback function.
     * @param callback Receives some object data about the currently authenticated user (object)
     */
    getUserData(callback: SDK.DataCallbackFn): void;

    /**
     * Sets the width of the current block.
     * @param width The block width. Can be specified as a number, or a string like `500px`
     * @param callback Called once the block expands to the specified width
     */
    setBlockEditorWidth(width: number, callback: () => void): void;
  }
}
