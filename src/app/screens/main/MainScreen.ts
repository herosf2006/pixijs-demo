import { FancyButton } from "@pixi/ui";
import { animate } from "motion";
import type { AnimationPlaybackControls } from "motion/react";
import type { Ticker } from "pixi.js";
import { Container, Graphics } from "pixi.js";

import { engine } from "../../getEngine";
import { PausePopup } from "../../popups/PausePopup";
import { SettingsPopup } from "../../popups/SettingsPopup";
import { Palette } from "./Palette";
import { Canvas } from "./Canvas";
import { PaintTube } from "./PaintTube";

/** The screen that holds the app */
export class MainScreen extends Container {
  /** Assets bundles required by this screen */
  public static assetBundles = ["main"];

  public mainContainer: Container;

  public paletteContainer  : Palette;
  public canvasContainer   : Canvas;
  public paintTubeContainer: PaintTube;

  private settingsButton: FancyButton;
  private bgGrid: Graphics;

  private paused = false;

  constructor() {
    super();

    this.mainContainer = new Container();

    this.paletteContainer   = new Palette();
    this.canvasContainer    = new Canvas();
    this.paintTubeContainer = new PaintTube();

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

    this.settingsButton = new FancyButton({
      defaultView: "icon-settings.png",
      anchor: 0.5,
      animations: buttonAnimations,
    });
    this.settingsButton.onPress.connect(() =>
      engine().navigation.presentPopup(SettingsPopup)
    );
    this.addChild(this.settingsButton);

    this.bgGrid = new Graphics();
    this.mainContainer.addChild(this.bgGrid);

    this.mainContainer.addChild(this.paletteContainer);
    this.mainContainer.addChild(this.canvasContainer);
    this.mainContainer.addChild(this.paintTubeContainer);

    this.paintTubeContainer.setBGColor(0x468A9A);
    this.paletteContainer.setBGColor(0x541212);
    this.canvasContainer.setBGColor(0x0F0E0E);
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
    this.settingsButton.x = width - (((height * 1) / 2) * 1) / 12;
    this.settingsButton.y = (((height * 1) / 2) * 1) / 12;

    const gridSize = 50;
    for (let x = 0; x < width; x += gridSize) {
      this.bgGrid.moveTo(x, 0).lineTo(x, height);
    }
    for (let y = 0; y < height; y += gridSize) {
      this.bgGrid.moveTo(0, y).lineTo(width, y);
    }
    this.bgGrid.stroke({ width: 1, color: 0x6a9ab0 });

    this.paintTubeContainer.x = 0;
    this.paintTubeContainer.y = 0;
    this.paintTubeContainer.resize(width, height * (1 / 12));

    this.paletteContainer.x = 0;
    this.paletteContainer.y = height * (1 / 12);
    this.paletteContainer.resize(width * (4 / 12), height * (11 / 12));

    this.canvasContainer.x = width * (4 / 12);
    this.canvasContainer.y = height * (1 / 12);
    this.canvasContainer.resize(width * (8 / 12), height * (11 / 12));

  }

  /** Show screen with animations */
  public async show(): Promise<void> {
    // engine().audio.bgm.play("main/sounds/bgm-main.mp3", { volume: 0.5 });

    const elementsToAnimate = [
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
        { duration: 0.3, delay: 0.75, ease: "backOut" }
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
