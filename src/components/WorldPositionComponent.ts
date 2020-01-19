import {Component} from "@nova-engine/ecs";

export type Vector2 = {
    x: number;
    y: number;
}

export class WorldPositionComponent implements Component {
    private _x: number = 0;
    private _y: number = 0;

    private _vel: Vector2 = {
        x: 0,
        y: 0
    };

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }


    get vel(): Vector2 {
        return this._vel;
    }

    set vel(value: Vector2) {
        this._vel = value;
    }
}