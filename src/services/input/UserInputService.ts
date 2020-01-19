import {InputEventListener} from "../../interface/input/InputEventListener";
import {sharedProvide} from "../../util/SharedProvide";

@sharedProvide(UserInputService)
export class UserInputService {

    protected eventListeners: InputEventListener[] = [];

    protected keymap: Record<string, boolean> = {};
    protected mousemap: Record<number, boolean> = {};


    constructor() {

        window.addEventListener('contextmenu', (event: MouseEvent) => this.onRightClick(event));
        window.addEventListener('click', (event: MouseEvent) => this.onClick(event));
        window.addEventListener('mousemove', (event: MouseEvent) => this.onMouseMove(event));
        window.addEventListener('wheel', (event: WheelEvent) => this.onWheelEvent(event));

        window.addEventListener('mousedown', (event: MouseEvent) => this.onMouseDown(event));
        window.addEventListener('mouseup', (event: MouseEvent) => this.onMouseUp(event));

        window.addEventListener('keydown', (event: KeyboardEvent) => this.onKeyDown(event));
        window.addEventListener('keyup', (event: KeyboardEvent) => this.onKeyUp(event));

        window.onblur = () => {
            for (const key in this.keymap) {
                if (this.keymap.hasOwnProperty(key)) {
                    this.keymap[key] = false;
                }
            }
        };

        window.oncontextmenu = () => {
            for (const key in this.keymap) {
                if (this.keymap.hasOwnProperty(key)) {
                    this.keymap[key] = false;
                }
            }
        };
    }

    public addEventListener(listener: InputEventListener): void {
        this.eventListeners.push(listener);
    }

    public isKeyPressed(key: string): boolean {
        key = key.toLowerCase();

        if (key in this.keymap) {
            return this.keymap[key];
        }

        return false;
    }

    public isMousePressed(mouse: number): boolean {
        if (mouse in this.mousemap) {
            return this.mousemap[mouse];
        }

        return false;
    }

    protected onKeyUp(event: KeyboardEvent): void {
        const key = event.key.toLowerCase();

        this.keymap[key] = false;

        this.dispatch('keyup', event);
    }

    protected onKeyDown(event: KeyboardEvent): void {
        const key = event.key.toLowerCase();

        this.keymap[key] = true;

        this.dispatch('keydown', event);
    }

    protected onMouseDown(event: MouseEvent): void {
        this.mousemap[event.button] = true;
    }

    protected onMouseUp(event: MouseEvent): void {
        event.preventDefault();

        this.mousemap[event.button] = false;
    }

    protected onMouseMove(event: MouseEvent): void {
        event.preventDefault();

        this.dispatch('mousemove', event);
    }

    protected onRightClick(event: MouseEvent): void {
        event.preventDefault();

        this.dispatch('rightclick', event);
    }

    protected onClick(event: MouseEvent): void {
        this.dispatch('click', event);
    }

    protected onWheelEvent(event: WheelEvent): void {
        this.dispatch('wheel', event);
    }


    protected dispatch(type: string, event: Event): void {
        this.eventListeners.forEach((eventListener: InputEventListener) => {
            eventListener.onInputEvent(type, event);
        });
    }

}