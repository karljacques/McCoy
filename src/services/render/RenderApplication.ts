import {Application, Container, Loader, Renderer, Ticker} from 'pixi.js';
import {sharedProvide} from "../../util/SharedProvide";

@sharedProvide(RenderApplication)
export class RenderApplication {
    static readonly WIDTH = 512;
    static readonly HEIGHT = 384;

    private _stageScale: number;

    protected application = new Application({
        resolution: devicePixelRatio
    });

    constructor() {
        console.log('RENDER_APPLICATION_INITIALISED');
        document.body.appendChild(this.application.view);

        this.onResize();

        this.application.start();
    }

    public getLoader(): Loader {
        return this.application.loader;
    }

    public getStage(): Container {
        return this.application.stage;
    }

    public getRenderer(): Renderer {
        return this.application.renderer;
    }

    public getTicker(): Ticker {
        return this.application.ticker;
    }

    protected onResize(): void {
        // Get the parent
        const parent = <HTMLElement>this.application.view.parentNode;

        // Resize the renderer
        this.application.renderer.resize(parent.clientWidth, parent.clientHeight);

        const vpw = parent.clientWidth;  // Width of the viewport
        const vph = parent.clientHeight; // Height of the viewport

        let nvw; // New game width
        let nvh; // New game height

        // The aspect ratio is the ratio of the screen's sizes in different dimensions.
        // The height-to-width aspect ratio of the game is HEIGHT / WIDTH.

        if (vph / vpw < RenderApplication.HEIGHT / RenderApplication.WIDTH) {
            // If height-to-width ratio of the viewport is less than the height-to-width ratio
            // of the game, then the height will be equal to the height of the viewport, and
            // the width will be scaled.
            nvh = vph;
            nvw = (nvh * RenderApplication.WIDTH) / RenderApplication.HEIGHT;
        } else {
            // In the else case, the opposite is happening.
            nvw = vpw;
            nvh = (nvw * RenderApplication.HEIGHT) / RenderApplication.WIDTH;
        }

        // Set the game screen size to the new values.
        // This command only makes the screen bigger --- it does not scale the contents of the game.
        // There will be a lot of extra room --- or missing room --- if we don't scale the stage.
        this.application.renderer.resize(nvw, nvh);

        this._stageScale = nvw / RenderApplication.WIDTH;
        this.application.stage.scale.set(nvw / RenderApplication.WIDTH, nvh / RenderApplication.HEIGHT);
    }


    get scale(): number {
        return this._stageScale;
    }
}