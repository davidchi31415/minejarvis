import mineflayer from 'mineflayer';
import { 
    StateTransition, NestedStateMachine,
    BehaviorIdle,
    BehaviorMineBlock, BehaviorMoveTo,
    BehaviorFindBlock, BehaviorFindInteractPosition
} from 'mineflayer-statemachine';
import mcData_pkg from 'minecraft-data';

    
function createMineActionState(bot) {
    const targets = {};
    const mcData = mcData_pkg(bot.version);

    const followRadius = 5;

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
            shouldTransition: () => lookAtPlayer.distanceToTarget() >= followRadius,
        }),
    ];

    return new NestedStateMachine(transitions, followPlayerState, exit);
}


export default createMineActionState;