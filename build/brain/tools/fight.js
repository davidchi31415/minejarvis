import { BaseActionTool } from './base';
class FightTool extends BaseActionTool {
    constructor() {
        super(...arguments);
        this.name = "FIGHT";
        this.description = "Call this when the bot is asked to fight nearby enemies.";
    }
    _call(arg) {
        return new Promise(() => { });
    }
}
