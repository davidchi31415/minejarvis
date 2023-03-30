"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mineflayer_statemachine_1 = require("mineflayer-statemachine");
function createFollowPlayerActionState(bot, data) {
    /**
     *  data is passed in by the bot root layer.
     *      * followRadius
     */
    const { followRadius } = data.params;
    const targets = {};
    // Enter and Exit
    const exit = new mineflayer_statemachine_1.BehaviorIdle(); // Create our states
    const getClosestPlayerState = new mineflayer_statemachine_1.BehaviorGetClosestEntity(bot, targets, (0, mineflayer_statemachine_1.EntityFilters)().PlayersOnly);
    const followPlayerState = new mineflayer_statemachine_1.BehaviorFollowEntity(bot, targets);
    const lookAtPlayerState = new mineflayer_statemachine_1.BehaviorLookAtEntity(bot, targets);
    // Create our transitions
    const transitions = [
        // We want to start following the player immediately after finding them.
        // Since getClosestPlayer finishes instantly, shouldTransition() should always return true.
        new mineflayer_statemachine_1.StateTransition({
            parent: getClosestPlayerState,
            child: followPlayerState,
            shouldTransition: () => true,
        }),
        // If the distance to the player is less than two blocks, switch from the followPlayer
        // state to the lookAtPlayer state.
        new mineflayer_statemachine_1.StateTransition({
            parent: followPlayerState,
            child: lookAtPlayerState,
            shouldTransition: () => followPlayerState.distanceToTarget() < followRadius,
        }),
        // If the distance to the player is more than two blocks, switch from the lookAtPlayer
        // state to the followPlayer state.
        new mineflayer_statemachine_1.StateTransition({
            parent: lookAtPlayerState,
            child: followPlayerState,
            shouldTransition: () => lookAtPlayerState.distanceToTarget() >= followRadius,
        }),
    ];
    return new mineflayer_statemachine_1.NestedStateMachine(transitions, getClosestPlayerState, exit);
}
exports.default = createFollowPlayerActionState;
