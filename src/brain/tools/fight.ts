import { Tool } from 'langchain/tools';
import { BaseActionTool } from './base';

class FightTool extends BaseActionTool {
    _call(arg: string): Promise<string> {
        return new Promise(() => {});
    }
    name: string = "FIGHT";
    description: string = "Call this when the bot is asked to fight nearby enemies.";
}