import { Tool } from 'langchain/tools';
export class BaseActionTool extends Tool {
    constructor(bot, data) {
        super();
        this.bot = bot;
        this.data = data;
    }
}
