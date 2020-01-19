import {RenderableComponent} from "./RenderableComponent";
import Sprite = PIXI.Sprite;

export class SimpleRenderableComponent extends RenderableComponent {
    private _sprite: Sprite;

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