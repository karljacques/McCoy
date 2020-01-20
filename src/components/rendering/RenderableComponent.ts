import Sprite = PIXI.Sprite;
import {Component} from "@nova-engine/ecs";
import DisplayObject = PIXI.DisplayObject;

export class RenderableComponent implements Component {
    static tag = 'RenderableComponent';

     protected _sprite: DisplayObject;

    get sprite() {
        return this._sprite;
    }

    set sprite(value) {
        this._sprite = value;
    }

    public setScreenPosition(x: number, y: number): void {
        this.sprite.position.x = x;
        this.sprite.position.y = y;
    }
}