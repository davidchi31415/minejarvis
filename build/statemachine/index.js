"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("./actions/index.js"));
const mappings_js_1 = __importDefault(require("./mappings.js"));
const mineflayer_statemachine_1 = require("mineflayer-statemachine");
function createRootLayer(bot, data) {
    /**
     * data is an object containing two attributes:
     *      action:
     *          This tells the state machine what action to transition to.
     *          It is an integer token, such as actionTokens.MINE.
     *      params:
     *          This object depends on the action to be performed. It is the
     *          info needed to carry out a task such as mining (i.e., what block?).
     *          See the individual action machines to see what parameters should
     *          look like.
     */
    const idleActionState = new mineflayer_statemachine_1.BehaviorIdle();
    const followActionState = index_js_1.default.createFollowPlayerActionState(bot, data);
    const mineActionState = index_js_1.default.createMineActionState(bot, data);
    const fightActionState = index_js_1.default.createFightActionState(bot, data);
    const idleToActionTransitions = [
        new mineflayer_statemachine_1.StateTransition({
            parent: idleActionState,
            child: followActionState,
            shouldTransition: () => data.action === mappings_js_1.default.FOLLOW_PLAYER,
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: idleActionState,
            child: mineActionState,
            shouldTransition: () => data.action === mappings_js_1.default.MINE,
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: idleActionState,
            child: fightActionState,
            shouldTransition: () => data.action === mappings_js_1.default.FIGHT,
        }),
    ];
    const actionToIdleTransitions = [
        new mineflayer_statemachine_1.StateTransition({
            parent: followActionState,
            child: idleActionState,
            shouldTransition: () => data.action !== mappings_js_1.default.FOLLOW_PLAYER,
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: mineActionState,
            child: idleActionState,
            shouldTransition: () => data.action !== mappings_js_1.default.MINE,
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: fightActionState,
            child: idleActionState,
            shouldTransition: () => data.action !== mappings_js_1.default.FIGHT,
        }),
    ];
    const transitions = [...idleToActionTransitions, ...actionToIdleTransitions];
    return new mineflayer_statemachine_1.NestedStateMachine(transitions, idleActionState);
}
exports.default = createRootLayer;
