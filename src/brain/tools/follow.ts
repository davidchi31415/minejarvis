import { Tool } from 'langchain/tools';
import { BaseActionTool } from './base';

class FollowTool extends BaseActionTool {
    _call(arg: string): Promise<string> {
        return new Promise(() => {});
    }
    name: string = "FOLLOW";
    description: string = "Call this when the bot needs to follow the player.";
}