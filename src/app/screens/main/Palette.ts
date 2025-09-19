import { FancyButton } from "@pixi/ui";
import { animate } from "motion";
import type { AnimationPlaybackControls } from "motion/react";
import type { Ticker } from "pixi.js";
import { Container, Graphics } from "pixi.js";

import { engine } from "../../getEngine";
import { PausePopup } from "../../popups/PausePopup";
import { SettingsPopup } from "../../popups/SettingsPopup";

/** The screen that holds the app */
export class Palette extends Container {
  private bgPalette: Graphics;

  private paused = false;

  constructor() {
    super();

    this.bgPalette = new Graphics();
    this.addChild(this.bgPalette);
  }

  /** Prepare the screen just before showing */
  public prepare() {}

  /** Update the screen */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_time: Ticker) {
    if (this.paused) return;
    // this.bouncer.update();
  }

  /** Pause gameplay - automatically fired when a popup is presented */
  public async pause() {
    this.interactiveChildren = false;
    this.paused = true;
  }

  /** Resume gameplay */
  public async resume() {
    this.interactiveChildren = true;
    this.paused = false;
  }

  /** Fully reset */
  public reset() {}

  /** Resize the screen, fired whenever window size changes */
  public resize(width: number, height: number) {
    // Create a rectangle
    this.bgPalette = new Graphics()
      .rect(0, height * (1/12), width * 0.5, height * (11/12))
      .fill(0x114232);
  }

  /** Show screen with animations */
  public async show(): Promise<void> {
    // engine().audio.bgm.play("main/sounds/bgm-main.mp3", { volume: 0.5 });

    const elementsToAnimate = [
      this.pauseButton,
      this.settingsButton,
      // this.addButton,
      // this.removeButton,
    ];

    let finalPromise!: AnimationPlaybackControls;
    for (const element of elementsToAnimate) {
      element.alpha = 0;
      finalPromise = animate(
        element,
        { alpha: 1 },
        { duration: 0.3, delay: 0.75, ease: "backOut" },
      );
    }

    await finalPromise;
    // this.bouncer.show(this);
  }

  /** Hide screen with animations */
  public async hide() {}

  /** Auto pause the app when window go out of focus */
  public blur() {
    if (!engine().navigation.currentPopup) {
      engine().navigation.presentPopup(PausePopup);
    }
  }
}
