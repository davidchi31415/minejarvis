import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
import { Bot } from 'mineflayer';
import { Entity } from 'prismarine-entity';
/**
 * Gets the closest entity to the bot and sets it as the entity
 * target. This behavior executes once right when the behavior
 * is entered, and should transition out immediately.
 */
export declare class BehaviorGetClosestMob implements StateBehavior {
    readonly bot: Bot;
    /**
     * The targets objects for this behavior.
     */
    readonly targets: StateMachineTargets;
    stateName: string;
    active: boolean;
    x?: number;
    y?: number;
    mobs: string[];
    mobType: string;
    radius: any;
    constructor(bot: Bot, targets: StateMachineTargets);
    onStateEntered(): void;
    /**
     * Gets the closest entity to the bot, filtering entities as needed.
     *
     * @returns The closest entity, or null if there are none.
     */
    private getClosestMob;
}
/**
 * The header for the EntityFilters() function.
 */
export interface EntityFiltersHeader {
    /**
     * Returns true for all entities.
     *
     * @param entity - The entity.
     */
    AllEntities: (entity: Entity) => boolean;
    /**
     * Returns true for all players. False for all other entities.
     *
     * @param entity - The entity.
     */
    PlayersOnly: (entity: Entity) => boolean;
    /**
     * Returns true for all mobs. False for all other entities.
     *
     * @param entity - The entity.
     */
    MobsOnly: (entity: Entity) => boolean;
    /**
     * Returns true for item drop entities and collectable arrows. False for
     * all other entities.
     *
     * @param entity - The entity.
     */
    ItemDrops: (entity: Entity) => boolean;
}
/**
 * Gets a list of many default entity filters which can be applied to
 * default state behaviors.
 */
export declare function EntityFilters(): EntityFiltersHeader;
