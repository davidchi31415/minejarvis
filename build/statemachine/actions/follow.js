import { StateTransition, NestedStateMachine, BehaviorIdle, BehaviorGetClosestEntity, BehaviorFollowEntity, BehaviorLookAtEntity, EntityFilters, } from 'mineflayer-statemachine';
export function createFollowPlayerActionState(bot, data) {
    /**
     *  data is passed in by the bot root layer.
     *      * followRadius
     */
    const { followRadius } = data.params;
    const targets = {};
    // Enter and Exit
    const exit = new BehaviorIdle(); // Create our states
    const getClosestPlayerState = new BehaviorGetClosestEntity(bot, targets, EntityFilters().PlayersOnly);
    const followPlayerState = new BehaviorFollowEntity(bot, targets);
    const lookAtPlayerState = new BehaviorLookAtEntity(bot, targets);
    // Create our transitions
    const transitions = [
        // We want to start following the player immediately after finding them.
        // Since getClosestPlayer finishes instantly, shouldTransition() should always return true.
        new StateTransition({
            parent: getClosestPlayerState,
            child: followPlayerState,
            shouldTransition: () => true,
        }),
        // If the distance to the player is less than two blocks, switch from the followPlayer
        // state to the lookAtPlayer state.
        new StateTransition({
            parent: followPlayerState,
            child: lookAtPlayerState,
            shouldTransition: () => followPlayerState.distanceToTarget() < followRadius,
        }),
        // If the distance to the player is more than two blocks, switch from the lookAtPlayer
        // state to the followPlayer state.
        new StateTransition({
            parent: lookAtPlayerState,
            child: followPlayerState,
            shouldTransition: () => lookAtPlayerState.distanceToTarget() >= followRadius,
        }),
    ];
    return new NestedStateMachine(transitions, getClosestPlayerState, exit);
}
