import {RenderableComponent} from "./RenderableComponent";
import {TypedSprite} from "../../types/TypedSprite";
import Container = PIXI.Container;
import Bounds = PIXI.Bounds;

export class TileMapComponent extends RenderableComponent {
    private _sprites: Array<TypedSprite> = [];

    private _stage: Container = new Container();

    public boundingBox: Bounds = new Bounds();

    get stage(): PIXI.Container {
        return this._stage;
    }

    public setScreenPosition(x: number, y: number): void {
        this._stage.position.x = x;
        this._stage.position.y = y;
    }

    get sprites(): Array<TypedSprite> {
        return this._sprites;
    }

    public addSprite(sprite: TypedSprite, x: number, y: number) {
        this._stage.addChild(sprite.sprite);
        sprite.sprite.position.x = x;
        sprite.sprite.position.y = y;

        this.boundingBox.minX = Math.min(x, this.boundingBox.minX);
        this.boundingBox.minY = Math.min(y, this.boundingBox.minY);

        this.boundingBox.maxX = Math.max(this.boundingBox.maxX, x + sprite.sprite.width);
        this.boundingBox.maxY = Math.max(this.boundingBox.maxY, y + sprite.sprite.height);

        this._sprites.push(sprite);
    }
}