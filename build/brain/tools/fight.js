"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class FightTool extends base_1.BaseActionTool {
    constructor() {
        super(...arguments);
        this.name = "FIGHT";
        this.description = "Call this when the bot is asked to fight nearby enemies.";
    }
    _call(arg) {
        return new Promise(() => { });
    }
}
