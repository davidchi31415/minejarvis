"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseActionTool = void 0;
const tools_1 = require("langchain/tools");
class BaseActionTool extends tools_1.Tool {
    constructor(bot, data) {
        super();
        this.bot = bot;
        this.data = data;
    }
}
exports.BaseActionTool = BaseActionTool;
