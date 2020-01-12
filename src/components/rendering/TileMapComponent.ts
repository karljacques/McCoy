import {RenderableComponent} from "./RenderableComponent";
import Container = PIXI.Container;
import Sprite = PIXI.Sprite;

interface TypedSprite {
    sprite: Sprite,
    type: string
}

export class TileMapComponent extends RenderableComponent {
    protected _sprites: Array<TypedSprite> = [];

    private _stage: Container = new Container();

    get stage(): PIXI.Container {
        return this._stage;
    }

    public setScreenPosition(x: number, y: number): void {
        this._stage.position.x = x;
        this._stage.position.y = y;
    }

    public addSprite(sprite: Sprite, x: number, y: number, type: string) {
        this._stage.addChild(sprite);
        sprite.position.x = x;
        sprite.position.y = y;

        this._sprites.push({
            sprite,
            type
        });
    }
}