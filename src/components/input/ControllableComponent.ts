import {Component} from "@nova-engine/ecs";

export class ControllableComponent implements Component {
    private _active: boolean;

    get active(): boolean {
        return this._active;
    }

    set active(value: boolean) {
        this._active = value;
    }

    private _jumpCoolDown: number = Date.now();

    get jumpCoolDown(): number {
        return this._jumpCoolDown;
    }

    set jumpCoolDown(value: number) {
        this._jumpCoolDown = value;
    }
}