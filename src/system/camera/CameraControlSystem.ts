import {Engine, System} from "@nova-engine/ecs";
import {InputEventListener} from "../../interface/input/InputEventListener";
import {sharedProvide} from "../../util/SharedProvide";
import {inject} from "inversify";
import {CameraSystem} from "../../services/render/CameraSystem";

@sharedProvide(CameraControlSystem)
export class CameraControlSystem extends System implements InputEventListener {
    @inject(CameraSystem) protected cameraSystem: CameraSystem;

    protected isMovingUp: boolean;
    protected isMovingDown: boolean;
    protected isMovingLeft: boolean;
    protected isMovingRight: boolean;

    onInputEvent(type: string, event: Event): void {
        switch (type) {
            case 'keydown':
                this.onKeyDown(event as KeyboardEvent);
                break;
            case 'keyup':
                this.onKeyRelease(event as KeyboardEvent);
                break;
        }
    }

    update(engine: Engine, delta: number): void {
        const vertDir = 0;
        //const vertDir = +!!this.isMovingUp - +!!this.isMovingDown;
        const horizDir = +!!this.isMovingRight - +!!this.isMovingLeft;

        this.cameraSystem.x += delta * horizDir;
        this.cameraSystem.y -= delta * vertDir;


    }

    protected onKeyChange(key: string, value: boolean) {
        switch (key.toLowerCase()) {
            case 'a':
                this.isMovingLeft = value;
                break;
            case 'd':
                this.isMovingRight = value;
                break;
            case 's':
                this.isMovingDown = value;
                break;
            case 'w':
                this.isMovingUp = value;
                break;
        }
    }

    protected onKeyDown(event: KeyboardEvent) {
        this.onKeyChange(event.key.toLowerCase(), true);
    }

    protected onKeyRelease(event: KeyboardEvent) {
        this.onKeyChange(event.key.toLowerCase(), false)
    }

}