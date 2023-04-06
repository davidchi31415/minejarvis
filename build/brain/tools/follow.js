"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class FollowTool extends base_1.BaseActionTool {
    constructor() {
        super(...arguments);
        this.name = "FOLLOW";
        this.description = "Call this when the bot needs to follow the player.";
    }
    _call(arg) {
        return new Promise(() => { });
    }
}
