import { BaseActionTool } from "./base";
import actionTokens from "../../statemachine/mappings";

export class MineTool extends BaseActionTool {
    _call(arg: string): Promise<string> {
        return new Promise(async () => {
            console.log('Attempting to Switch to Mine.');

            this.data.action = actionTokens.IDLE;

            function wait(ms: any) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            await wait(100);

            this.data.params.blockName = "emerald_ore";
            this.data.params.quantity = 2;
            this.data.action = actionTokens.MINE;
            this.data.stack.push(actionTokens.MINE);

            return "mined a block";
        });
    }
    name: string = "MINE";
    description: string = "Call this to mine a block. Input should be the name of the block.";
}