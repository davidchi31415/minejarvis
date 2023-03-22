import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
import { Bot, Player } from 'mineflayer';
import { Movements } from 'mineflayer-pathfinder';
/**
 * Explores surrounding terrain as long as there is room.
 */
export declare class BehaviorExplore implements StateBehavior {
    /**
     * The bot this behavior is acting on.
     */
    readonly bot: Bot;
    /**
     * The targets objects for this behavior.
     */
    readonly targets: StateMachineTargets;
    /**
     * The data for the bot.
     */
    private readonly mcData;
    /**
     * The player to remain within a certain distance of.
     */
    readonly player: Player;

    movements: Movements;
    stateName: string;
    active: boolean;
    x?: number;
    y?: number;

    constructor(bot: Bot, targets: StateMachineTargets);
    onStateEntered(): void;
    onStateExit(): void;
    /**
     * Sets the current exploratory path this bot should pursue. 
     * Calling this method will update the targets object.
     */
    setExplorePath(): void;
    /**
     * Cancels the current path finding operation.
     */
    private stopMoving;
    /**
     * Starts a new path finding operation.
     */
    private startMoving;
    /**
     * Stops and restarts this movement behavior. Does nothing if
     * this behavior is not active.
     *
     * Useful for transitioning between states.
     */
    restart(): void;
    /**
     * Gets the distance to the player entity.
      *
      * @returns The distance, or 0 if no player entity is assigned/found.
      */
    distanceToPlayer(): number;
}