import { Tool } from 'langchain/tools';
import { Bot } from 'mineflayer';
import { StateData } from '../../interfaces';

export abstract class BaseActionTool extends Tool {
    bot: Bot;
    data: StateData;

    constructor(bot: Bot, data: StateData) {
        super();
        this.bot = bot;
        this.data = data;
    }
}