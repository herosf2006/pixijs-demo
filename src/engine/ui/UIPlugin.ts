import { ExtensionType } from "pixi.js";
import type { Application, ExtensionMetadata } from "pixi.js";

import type { CreationEngine } from "../engine";

import { UI } from "./ui";

/**
 * Middleware for Application's UI functionality.
 *
 * Adds the following methods to Application:
 * * Application#ui
 */
export class CreationUIPlugin {
  /** @ignore */
  public static extension: ExtensionMetadata = ExtensionType.Application;

  private static _onResize: (() => void) | null;

  /**
   * Initialize the plugin with scope of application instance
   */
  public static init(): void {
    const app = this as unknown as CreationEngine;

    app.ui = new UI();
    app.ui.init(app);
    this._onResize = () =>
      app.ui.resize(app.renderer.width, app.renderer.height);
    app.renderer.on("resize", this._onResize);
    app.resize();
  }

  /**
   * Clean up the ticker, scoped to application
   */
  public static destroy(): void {
    const app = this as unknown as Application;
    app.ui = null as unknown as UI;
  }
}
