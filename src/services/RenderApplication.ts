import {Application, Container, Loader} from 'pixi.js';
import {sharedProvide} from "../util/SharedProvide";

@sharedProvide(RenderApplication)
export class RenderApplication {
    protected application = new Application();

    constructor() {
        console.log('RENDER_APPLICATION_INITIALISED');
        document.body.appendChild(this.application.view);
    }

    public getLoader(): Loader {
        return this.application.loader;
    }

    public getStage(): Container {
        return this.application.stage;
    }
}