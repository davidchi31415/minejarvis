"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mine_1 = __importDefault(require("./mine"));
const follow_1 = __importDefault(require("./follow"));
const fight_1 = __importDefault(require("./fight"));
const actionStates = {
    createMineActionState: mine_1.default,
    createFollowPlayerActionState: follow_1.default,
    createFightActionState: fight_1.default,
};
exports.default = actionStates;
