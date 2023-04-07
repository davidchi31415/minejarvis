import { Tool } from "langchain/tools";
import { Bot } from "mineflayer";
import { StateData } from "../../interfaces/index.js";
export declare abstract class BaseActionTool extends Tool {
    bot: Bot;
    data: StateData;
    constructor(bot: Bot, data: StateData);
}
