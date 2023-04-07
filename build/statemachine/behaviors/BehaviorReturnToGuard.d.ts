import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
import { Bot } from 'mineflayer';
/**
 * This behavior will attempt to fight a mob. If the bot has
 * a sword and/or a shield, it will equip them.
 */
export declare class BehaviorReturnToGuard implements StateBehavior {
    readonly bot: Bot;
    readonly targets: StateMachineTargets;
    stateName: string;
    active: boolean;
    x?: number;
    y?: number;
    /**
     * Checks if the bot has finished mining the block or not.
     */
    isFinished: boolean;
    guardPos: any;
    /**
     * Creates a new mine block behavior.
     *
     * @param bot - The bot preforming the mining function.
     * @param targets - The bot targets objects.
     */
    constructor(bot: Bot, targets: StateMachineTargets);
    onStateEntered(): void;
}
