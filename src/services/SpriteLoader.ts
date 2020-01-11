import {inject} from "inversify";
import {RenderApplication} from "./RenderApplication";
import {provide} from "inversify-binding-decorators";
import {Loader} from 'pixi.js';

@provide(SpriteLoader)
class SpriteLoader {
    protected loader: Loader;

    constructor(
        @inject(RenderApplication) renderApplication: RenderApplication
    ) {
        this.loader = renderApplication.getLoader();
    }


}