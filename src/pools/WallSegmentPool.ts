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

        this.createSprites('decoration_01', 6, 'DECORATION');
        this.createSprites('decoration_02', 6, 'DECORATION');
        this.createSprites('decoration_03', 6, 'DECORATION');

        this.createSprites('edge_01', 3, 'FRONT_EDGE');
        this.createSprites('edge_02', 3, 'BACK_EDGE', true);


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

    protected createSprites(textureName: string, count: number, type: string, flip: boolean = false) {
        if (!this._spriteTypes.hasOwnProperty(type)) {
            this._spriteTypes[type] = [];
        }

        for (let i = 0; i < count; i++) {
            const sprite = this.wallSpriteFactory.createSprite(textureName);
            if (flip) {
                sprite.anchor.x = 1;
                sprite.scale.x = -1;
            }
            this._spriteTypes[type].push(sprite);
        }
    }

}