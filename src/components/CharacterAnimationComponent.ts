export class CharacterAnimationComponent {

    private _stateChanged: boolean = false;

    get stateChanged(): boolean {
        return this._stateChanged;
    }

    private _running: boolean = false;

    get running(): boolean {
        return this._running;
    }

    set running(value: boolean) {
        if (this.running !== value) {
            this._stateChanged = true;
        }

        this._running = value;
    }

    private _jumping: boolean = false;

    get jumping(): boolean {
        return this._jumping;
    }

    set jumping(value: boolean) {
        if (this.jumping !== value) {
            this._stateChanged = true;
        }
        this._jumping = value;
    }

    private _directionX: number = 1;

    get directionX(): number {
        return this._directionX;
    }

    set directionX(value: number) {
        this._directionX = value;
    }

    public reset() {
        this._stateChanged = false;
    }
}