import { BaseActionTool } from './base';
class GuardTool extends BaseActionTool {
    constructor() {
        super(...arguments);
        this.name = "GUARD";
        this.description = "Call this when the bot is asked to guard a specific area from nearby enemies";
    }
    _call(arg) {
        return new Promise(() => { });
    }
}
