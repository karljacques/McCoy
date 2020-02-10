import {Component} from "@nova-engine/ecs";

export class ControllableComponent implements Component {
    private _onGround = false;
    private _active: boolean;
    private _doubleJumpSpent: boolean;

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


    get onGround(): boolean {
        return this._onGround;
    }

    get doubleJumpSpent(): boolean {
        return this._doubleJumpSpent;
    }

    set doubleJumpSpent(value: boolean) {
        this._doubleJumpSpent = value;
    }

    set onGround(value: boolean) {
        if (value === true) {
            this.doubleJumpSpent = false;
        }
        this._onGround = value;
    }
}