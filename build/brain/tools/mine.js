var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseActionTool } from "./base.js";
import actionTokens from "../../statemachine/mappings.js";
export class MineTool extends BaseActionTool {
    constructor() {
        super(...arguments);
        this.name = "MINE";
        this.description = "Call this to mine a block. Input should be the name of the block.";
    }
    _call(arg) {
        return new Promise(() => __awaiter(this, void 0, void 0, function* () {
            console.log('Attempting to Switch to Mine.');
            this.data.action = actionTokens.IDLE;
            function wait(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            yield wait(100);
            this.data.params.blockName = "emerald_ore";
            this.data.params.quantity = 2;
            this.data.action = actionTokens.MINE;
            this.data.stack.push(actionTokens.MINE);
            return "mined a block";
        }));
    }
}