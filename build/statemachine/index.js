"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// MineJARVIS API
const actions_1 = require("./actions");
const mappings_1 = __importDefault(require("./mappings"));
// Mineflayer API
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
    const followActionState = (0, actions_1.createFollowPlayerActionState)(bot, data);
    const mineActionState = (0, actions_1.createMineActionState)(bot, data);
    const fightActionState = (0, actions_1.createFightActionState)(bot, data);
    const guardActionState = (0, actions_1.createGuardActionState)(bot, data);
    const idleToActionTransitions = [
        new mineflayer_statemachine_1.StateTransition({
            parent: idleActionState,
            child: followActionState,
            shouldTransition: () => data.action === mappings_1.default.FOLLOW_PLAYER,
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: idleActionState,
            child: mineActionState,
            shouldTransition: () => data.action === mappings_1.default.MINE,
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: idleActionState,
            child: fightActionState,
            shouldTransition: () => data.action === mappings_1.default.FIGHT,
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: idleActionState,
            child: guardActionState,
            shouldTransition: () => data.action === mappings_1.default.GUARD,
        }),
    ];
    const actionToIdleTransitions = [
        new mineflayer_statemachine_1.StateTransition({
            parent: followActionState,
            child: idleActionState,
            shouldTransition: () => data.action !== mappings_1.default.FOLLOW_PLAYER,
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: mineActionState,
            child: idleActionState,
            shouldTransition: () => data.action !== mappings_1.default.MINE,
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: fightActionState,
            child: idleActionState,
            shouldTransition: () => data.action !== mappings_1.default.FIGHT,
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: guardActionState,
            child: idleActionState,
            shouldTransition: () => data.action !== mappings_1.default.GUARD,
        }),
    ];
    const transitions = [...idleToActionTransitions, ...actionToIdleTransitions];
    return new mineflayer_statemachine_1.NestedStateMachine(transitions, idleActionState);
}
exports.default = createRootLayer;
