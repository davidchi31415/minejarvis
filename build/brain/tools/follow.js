import { BaseActionTool } from './base';
class FollowTool extends BaseActionTool {
    constructor() {
        super(...arguments);
        this.name = "FOLLOW";
        this.description = "Call this when the bot needs to follow the player.";
    }
    _call(arg) {
        return new Promise(() => { });
    }
}
