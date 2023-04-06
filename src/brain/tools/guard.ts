import { Tool } from 'langchain/tools';
import { BaseActionTool } from './base';

class GuardTool extends BaseActionTool {
    _call(arg: string): Promise<string> {
        return new Promise(() => {});
    }
    name: string = "GUARD";
    description: string = "Call this when the bot is asked to guard a specific area from nearby enemies";
}