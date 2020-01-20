import {provide} from "inversify-binding-decorators";
import {WallSpriteFactory} from "../factories/game/WallSpriteFactory";
import {inject} from "inversify";
import {TypedSprite} from "../types/TypedSprite";
import Sprite = PIXI.Sprite;
import {SpriteSheetFactory} from "../factories/render/SpriteSheetFactory";

const shuffle = require('shuffle-array');

@provide(WallSegmentPool)
export class WallSegmentPool {
    static readonly WINDOW_COUNT = 6;

    protected _spriteTypes: Record<string, Array<Sprite>> = {};

    constructor(@inject(SpriteSheetFactory) protected spriteSheetFactory: SpriteSheetFactory) {
        this.createSprites('window_01', WallSegmentPool.WINDOW_COUNT, 'WINDOW');
        this.createSprites('window_02', WallSegmentPool.WINDOW_COUNT, 'WINDOW');

        this.createSprites('decoration_01', 6, 'DECORATION');
        this.createSprites('decoration_02', 6, 'DECORATION');
        this.createSprites('decoration_03', 6, 'DECORATION');

        this.createSprites('edge_01', 3, 'FRONT_EDGE');
        this.createSprites('edge_02', 3, 'BACK_EDGE', true);

        this.createSprites('step_01', 3, 'STEP_UP', true);
        this.createSprites('step_01', 3, 'STEP_DOWN');


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
        sprite.sprite.position.x = -1000;
        sprite.sprite.position.y = -1000;
        sprite.sprite.visible = false;


        this._spriteTypes[sprite.type].push(sprite.sprite);
    }

    protected createSprites(textureName: string, count: number, type: string, flip: boolean = false) {
        if (!this._spriteTypes.hasOwnProperty(type)) {
            this._spriteTypes[type] = [];
        }

        for (let i = 0; i < count; i++) {
            const sprite = this.spriteSheetFactory.createSprite('wall', textureName);
            if (flip) {
                sprite.anchor.x = 1;
                sprite.scale.x = -1;
            }
            sprite.visible = false;
            this._spriteTypes[type].push(sprite);
        }
    }

}