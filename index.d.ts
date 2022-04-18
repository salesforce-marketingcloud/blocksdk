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
      blockEditorWidth?: string | number;
      tabs?: CustomTabs[];
    }

    export interface Auth2Options {
      authURL: string;
      clientId: string;
      redirectURL: string;
      scope?: string[];
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

    triggerAuth(authID: string): void;
    triggerAuth2(options: SDK.Auth2Options): void;

    getContent(callback: SDK.ContentCallbackFn): void;
    setContent(content: string, callback?: SDK.ContentCallbackFn): void;
    setSuperContent(
      superContent: string,
      callback?: SDK.ContentCallbackFn
    ): void;

    getData(callback: SDK.DataCallbackFn): void;
    setData(data: any, callback: SDK.DataCallbackFn): void;

    getUserData(callback: SDK.DataCallbackFn): void;

    setBlockEditorWidth(width: number, callback: () => void): void;
  }
}
