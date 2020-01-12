import {Component} from "@nova-engine/ecs";
import TilingSprite = PIXI.TilingSprite;

export class BackgroundLayerComponent implements Component {
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
}