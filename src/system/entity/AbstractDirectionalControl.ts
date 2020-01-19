import {System} from "@nova-engine/ecs";

export abstract class AbstractDirectionalControl extends System {

    protected isMovingUp: boolean = false;
    protected isMovingDown: boolean = false;
    protected isMovingLeft: boolean = false;
    protected isMovingRight: boolean = false;

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
            case ' ':
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
