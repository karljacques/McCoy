import {Component} from "@nova-engine/ecs";
import {Sprite} from 'pixi.js';

export class SpriteRenderComponent implements Component {
    private _sprite: Sprite;

    get sprite(): Sprite {
        return this._sprite;
    }

    set sprite(value: Sprite) {
        this._sprite = value;
    }


}