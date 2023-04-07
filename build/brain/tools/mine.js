import { BaseActionTool } from "./base.js";
import actionTokens from "../../statemachine/mappings.js";
export class MineTool extends BaseActionTool {
    constructor() {
        super(...arguments);
        this.name = "MINE";
        this.description = "Call this to mine a block. Input should be the name of the block.";
    }
    _call(arg) {
        return new Promise(async () => {
            console.log("Attempting to Switch to Mine.");
            this.data.action = actionTokens.IDLE;
            function wait(ms) {
                return new Promise((resolve) => setTimeout(resolve, ms));
            }
            await wait(100);
            this.data.params.blockName = "emerald_ore";
            this.data.params.quantity = 2;
            this.data.action = actionTokens.MINE;
            this.data.stack.push(actionTokens.MINE);
            return "mined a block";
        });
    }
}
//# sourceMappingURL=mine.js.map