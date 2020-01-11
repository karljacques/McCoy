import {provide} from 'inversify-binding-decorators';
import {Application, Loader} from 'pixi.js';

@provide(RenderApplication)
export class RenderApplication {
    protected application = new Application();

    constructor() {
        console.log('RENDER_APPLICATION_INITIALISED');
        document.body.appendChild(this.application.view);
    }

    public getLoader(): Loader {
        return this.application.loader;
    }
}