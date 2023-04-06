"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class GuardTool extends base_1.BaseActionTool {
    constructor() {
        super(...arguments);
        this.name = "GUARD";
        this.description = "Call this when the bot is asked to guard a specific area from nearby enemies";
    }
    _call(arg) {
        return new Promise(() => { });
    }
}
