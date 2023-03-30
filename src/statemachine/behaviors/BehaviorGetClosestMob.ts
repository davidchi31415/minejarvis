import {StateBehavior, StateMachineTargets} from 'mineflayer-statemachine';
import {Bot} from 'mineflayer';
import {Entity} from 'prismarine-entity';
import {plugin as pvpPlugin} from 'mineflayer-pvp';
/**
 * Gets the closest entity to the bot and sets it as the entity
 * target. This behavior executes once right when the behavior
 * is entered, and should transition out immediately.
 */
export class BehaviorGetClosestMob implements StateBehavior {
  readonly bot: Bot;

  /**
   * The targets objects for this behavior.
   */
  readonly targets: StateMachineTargets;

  stateName = 'getClosestEntity';
  active = false;
  x?: number;
  y?: number;
  mobs: string[] = [];

  constructor(
    bot: Bot,
    targets: StateMachineTargets
  ) {
    this.bot = bot;
    this.targets = targets;
    this.bot.loadPlugin(pvpPlugin);
  }

  onStateEntered(): void {
    this.targets.entity = this.getClosestMob() ?? undefined;
    if (this.targets.entity) {
      this.targets.position = this.targets.entity.position;
    }
  }

  /**
   * Gets the closest entity to the bot, filtering entities as needed.
   *
   * @returns The closest entity, or null if there are none.
   */
  private getClosestMob(): Entity | null {
    const mobFilter = (e: Entity) => true; // e.mobType?.toUpperCase() === 'ZOMBIE';
    const mob = this.bot.nearestEntity(mobFilter);
    return mob;
  }
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
export function EntityFilters(): EntityFiltersHeader {
  return {
    AllEntities: function (): boolean {
      return true;
    },

    PlayersOnly: function (entity: Entity): boolean {
      return entity.type === 'player';
    },

    MobsOnly: function (entity: Entity): boolean {
      return entity.type === 'mob';
    },

    ItemDrops: function (entity: Entity): boolean {
      if (entity.objectType === 'Item') {
        return true;
      }

      if (entity.objectType === 'Arrow') {
        // TODO Check if arrow can be picked up
        // Current NBT parsing is too limited to effectively check.

        return true;
      }

      return false;
    },
  };
}
