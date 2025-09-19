import { FancyButton } from "@pixi/ui";
import { animate } from "motion";
import type { AnimationPlaybackControls } from "motion/react";
import type { Ticker } from "pixi.js";
import { Container, Graphics } from "pixi.js";

import { engine } from "../../getEngine";
import { PausePopup } from "../../popups/PausePopup";
import { SettingsPopup } from "../../popups/SettingsPopup";
import { Button } from "../../ui/Button";

import { Bouncer } from "./Bouncer";

/** The screen that holds the app */
export class MainScreen extends Container {
  /** Assets bundles required by this screen */
  public static assetBundles = ["main"];

  public mainContainer: Container;
  public paletteContainer: Container;
  public canvasContainer: Container;

  private pauseButton: FancyButton;
  private settingsButton: FancyButton;
  private bgGrid: Graphics;
  private bgPalette: Graphics;
  private bgCanvas: Graphics;
  // private addButton: FancyButton;
  // private removeButton: FancyButton;
  // private bouncer: Bouncer;
  private paused = false;

  constructor() {
    super();

    this.mainContainer = new Container();
    this.paletteContainer = new Container();
    this.canvasContainer = new Container();
    this.addChild(this.mainContainer);

    const buttonAnimations = {
      hover: {
        props: {
          scale: { x: 1.1, y: 1.1 },
        },
        duration: 100,
      },
      pressed: {
        props: {
          scale: { x: 0.9, y: 0.9 },
        },
        duration: 100,
      },
    };
    this.pauseButton = new FancyButton({
      defaultView: "icon-pause.png",
      anchor: 0.5,
      animations: buttonAnimations,
    });
    this.pauseButton.onPress.connect(() =>
      engine().navigation.presentPopup(PausePopup),
    );
    this.addChild(this.pauseButton);

    this.settingsButton = new FancyButton({
      defaultView: "icon-settings.png",
      anchor: 0.5,
      animations: buttonAnimations,
    });
    this.settingsButton.onPress.connect(() =>
      engine().navigation.presentPopup(SettingsPopup),
    );
    this.addChild(this.settingsButton);

    this.bgGrid = new Graphics();
    this.mainContainer.addChild(this.bgGrid);
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
    this.mainContainer.interactiveChildren = false;
    this.paused = true;
  }

  /** Resume gameplay */
  public async resume() {
    this.mainContainer.interactiveChildren = true;
    this.paused = false;
  }

  /** Fully reset */
  public reset() {}

  /** Resize the screen, fired whenever window size changes */
  public resize(width: number, height: number) {
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    this.paletteContainer.x = centerX;
    this.paletteContainer.y = centerY;
    this.canvasContainer.x = centerX;
    this.canvasContainer.y = centerY;

    // Create a rectangle
    const bgPalette = new Graphics()
      .rect(0, height * (1/12), width * 0.5, height * (11/12))
      .fill(0x114232);
    this.mainContainer.addChild(bgPalette);

    const bgCanvas = new Graphics()
      .rect(width * 0.5, height * (1/12), width * 0.5, height * (11/12))
      .fill(0x87A922);
    this.mainContainer.addChild(bgCanvas);

    this.pauseButton.x = 30;
    this.pauseButton.y = 30;
    this.settingsButton.x = width - 30;
    this.settingsButton.y = 30;

    const gridSize = 50;
    for (let x = 0; x < width; x += gridSize) {
      this.bgGrid.moveTo(x, 0).lineTo(x, height);
    }
    for (let y = 0; y < height; y += gridSize) {
      this.bgGrid.moveTo(0, y).lineTo(width, y);
    }
    this.bgGrid.stroke({ width: 1, color: 0x6A9AB0 });

    // this.removeButton.x = width / 2 - 100;
    // this.removeButton.y = height - 75;
    // this.addButton.x = width / 2 + 100;
    // this.addButton.y = height - 75;

    // this.bouncer.resize(width, height);
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
