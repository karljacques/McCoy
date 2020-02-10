import {RenderableComponent} from "./RenderableComponent";
import TilingSprite = PIXI.TilingSprite;

export class BackgroundLayerComponent extends RenderableComponent {

    get sprite(): PIXI.TilingSprite {
        return this._sprite as TilingSprite;
    }

    set sprite(value: PIXI.TilingSprite) {
        this._sprite = value;
    }

    private _distance: number;

    get distance(): number {
        return this._distance;
    }

    set distance(value: number) {
        this._distance = value;
    }

    setScreenPosition(x: number, y: number): void {
        this.sprite.tilePosition.x = -x / this.distance;
    }
}