import {provide} from "inversify-binding-decorators";
import {WallSpriteFactory} from "../factories/game/WallSpriteFactory";
import {inject} from "inversify";
import Sprite = PIXI.Sprite;

const shuffle = require('shuffle-array');

@provide(WallSegmentPool)
export class WallSegmentPool {
    static readonly WINDOW_COUNT = 6;

    protected _windows: Array<Sprite> = [];

    constructor(@inject(WallSpriteFactory) protected wallSpriteFactory: WallSpriteFactory) {
        this.createWindows('window_01', WallSegmentPool.WINDOW_COUNT);
        this.createWindows('window_02', WallSegmentPool.WINDOW_COUNT);

        shuffle(this._windows);
    }

    public getWindow(): Sprite {
        return this._windows.pop();
    }

    public giveBackWindow(sprite: Sprite): void {
        sprite.position.x = 0;
        sprite.position.y = 0;

        this._windows.push(sprite);
    }

    protected createWindows(textureName: string, count: number) {
        for (let i = 0; i < count; i++) {
            this._windows.push(this.wallSpriteFactory.createSprite(textureName));
        }
    }
}