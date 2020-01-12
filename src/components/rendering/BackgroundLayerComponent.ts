import {RenderableComponent} from "./RenderableComponent";
import TilingSprite = PIXI.TilingSprite;

export class BackgroundLayerComponent extends RenderableComponent {
    private _sprite: TilingSprite;

    get sprite(): PIXI.TilingSprite {
        return this._sprite;
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
        this.sprite.tilePosition.x = x / this.distance;
    }
}