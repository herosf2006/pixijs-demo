import { FancyButton, List } from "@pixi/ui";
import type { FillInput, Ticker } from "pixi.js";
import { Container, Graphics, Text } from "pixi.js";

import { engine } from "../../getEngine";
import { PausePopup } from "../../popups/PausePopup";
import { defaultUIPalette } from "../../data/palettes";

/** The screen that holds the app */
export class Palette extends Container {
  private bg: Graphics;
  private bgColor: FillInput | undefined;
  private scheme: Graphics;

  private paused = false;
  private width = 0;
  private height = 0;

  private buttonW = 70;
  private buttonH = 70;
  private buttonR = 12;

  constructor() {
    super();

    this.bg = new Graphics();
    this.addChild(this.bg);

    const palettes = defaultUIPalette;
    this.scheme = new Graphics();

    // let  = new FancyButton({
    //   defaultView: "icon-settings.png",
    //   anchor: 0.5,
    //   animations: buttonAnimations,
    // });
    // this.settingsButton.onPress.connect(() =>
    //   engine().navigation.presentPopup(SettingsPopup)
    // );
    // this.addChild(this.settingsButton);
  }

  /** Prepare the screen just before showing */
  public prepare() {}

  /** Update the screen */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_time: Ticker) {
    if (this.paused) return;
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
    this.width = width;
    this.height = height;
    this.bg.clear();
    this.bg.rect(0, 0, width, height).fill(this.bgColor);
    this.addScheme();
  }

  public setBGColor(color: FillInput | undefined) {
    this.bgColor = color;
    this.bg.clear().fill(color);
  }

  public addScheme() {
    this.scheme.roundRect(0, 0, 290, 290, 20).fill(0xFDF4E3).stroke({
      color: 0xED3F27,
      width: 1
    });

    const itemsAmount = 9;
    const items = [];
    for (let i = 0; i < itemsAmount; i++) {
      const text = new Text({
        text: i + 1,
        style: {
          fill: 0xFFFFFF,
        }
      });
      const button = new FancyButton({
        defaultView: new Graphics().roundRect(0, 0, this.buttonW, this.buttonH, this.buttonR).fill(0x134686).roundRect(8, 8, this.buttonW - 3, this.buttonH - 3, this.buttonR).stroke({
          color: 0x134686,
          width: 2
        }),
        hoverView: new Graphics().roundRect(0, 0, this.buttonW, this.buttonH, this.buttonR).fill(0xED3F27).roundRect(8, 8, this.buttonW - 3, this.buttonH - 3, this.buttonR).stroke({
          color: 0xED3F27,
          width: 2
        }),
        pressedView: new Graphics().roundRect(4, 4, this.buttonW, this.buttonH, this.buttonR).fill(0xFEB21A).roundRect(8, 8, this.buttonW - 1, this.buttonH - 1, this.buttonR).stroke({
          color: 0xFEB21A,
          width: 2
        }),
        text
      });
      button.anchor.set(0);
      items.push(button);
    }

    const elementsMargin = 10;
    const padding = 20;
    const list = new List({
      elementsMargin,
      padding,
    });
    this.scheme.addChild(list);
    this.addChild(this.scheme);
    items.forEach(item => list.addChild(item));
  }

  /** Show screen with animations */
  public async show(): Promise<void> {}

  /** Hide screen with animations */
  public async hide() {}

  /** Auto pause the app when window go out of focus */
  public blur() {
    if (!engine().navigation.currentPopup) {
      engine().navigation.presentPopup(PausePopup);
    }
  }
}
