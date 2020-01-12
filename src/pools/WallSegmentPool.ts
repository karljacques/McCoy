import {provide} from "inversify-binding-decorators";
import {WallSpriteFactory} from "../factories/game/WallSpriteFactory";
import {inject} from "inversify";
import {TypedSprite} from "../types/TypedSprite";
import Sprite = PIXI.Sprite;

const shuffle = require('shuffle-array');

@provide(WallSegmentPool)
export class WallSegmentPool {
    static readonly WINDOW_COUNT = 6;

    protected _spriteTypes: Record<string, Array<Sprite>> = {};

    constructor(@inject(WallSpriteFactory) protected wallSpriteFactory: WallSpriteFactory) {
        this.createSprites('window_01', WallSegmentPool.WINDOW_COUNT, 'WINDOW');
        this.createSprites('window_02', WallSegmentPool.WINDOW_COUNT, 'WINDOW');

        for (let key in this._spriteTypes) {
            if (this._spriteTypes.hasOwnProperty(key)) {
                shuffle(this._spriteTypes[key]);
            }
        }
    }

    public getSprite(type: string): TypedSprite {
        const sprite = this._spriteTypes[type].pop();

        return {
            sprite,
            type
        };
    }

    public giveBackSprite(sprite: TypedSprite): void {
        sprite.sprite.position.x = 0;
        sprite.sprite.position.y = 0;

        this._spriteTypes[sprite.type].push(sprite.sprite);
    }

    protected createSprites(textureName: string, count: number, type: string) {
        if (!this._spriteTypes.hasOwnProperty(type)) {
            this._spriteTypes[type] = [];
        }

        for (let i = 0; i < count; i++) {
            this._spriteTypes[type].push(this.wallSpriteFactory.createSprite(textureName));
        }
    }

}