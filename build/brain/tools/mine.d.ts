import { BaseActionTool } from "./base.js";
export declare class MineTool extends BaseActionTool {
    _call(arg: string): Promise<string>;
    name: string;
    description: string;
}
