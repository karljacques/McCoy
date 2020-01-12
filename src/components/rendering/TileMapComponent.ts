import {Component} from "@nova-engine/ecs";
import Container = PIXI.Container;
import Sprite = PIXI.Sprite;

interface TypedSprite {
    sprite: Sprite,
    type: string
}

export class TileMapComponent implements Component {
    protected _sprites: Array<TypedSprite> = [];

    private _stage: Container = new Container();

    get stage(): PIXI.Container {
        return this._stage;
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