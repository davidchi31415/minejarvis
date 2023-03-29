import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine'
import { Bot } from 'mineflayer'
import { Entity } from 'prismarine-entity'
/**
 * Gets the closest entity to the bot and sets it as the entity
 * target. This behavior executes once right when the behavior
 * is entered, and should transition out immediately.
 */
export class BehaviorGetClosestMob implements StateBehavior {
  /**
     * The bot this behavior is acting on.
     */
  readonly bot: Bot

  /**
     * The targets objects for this behavior.
     */
  readonly targets: StateMachineTargets

  /**
     * The filter being used to find entities with.
     */
  filter: (entity: Entity) => boolean

  stateName: string = 'getClosestEntity'
  active: boolean = false
  x?: number
  y?: number
  mobs: string[] = []

  constructor (bot: Bot, targets: StateMachineTargets, filter: (entity: Entity) => boolean) {
    this.bot = bot
    this.targets = targets
    this.filter = filter
  }

  onStateEntered (): void {
    this.targets.entity = this.getClosestMob() ?? undefined
    if (this.targets.entity != null) {
        this.targets.position = this.targets.entity.position
    }
  }

  /**
     * Gets the closest entity to the bot, filtering entities as needed.
     *
     * @returns The closest entity, or null if there are none.
     */
  private getClosestMob (): Entity | null {
    let closest = null
    let distance = 0
    const mobFilter = e => e.type === 'mob' && e.mobType === 'Zombie'
    const mob = this.bot.nearestEntity(mobFilter)

    return mob
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
  AllEntities: (entity: Entity) => boolean

  /**
     * Returns true for all players. False for all other entities.
     *
     * @param entity - The entity.
     */
  PlayersOnly: (entity: Entity) => boolean

  /**
     * Returns true for all mobs. False for all other entities.
     *
     * @param entity - The entity.
     */
  MobsOnly: (entity: Entity) => boolean

  /**
     * Returns true for item drop entities and collectable arrows. False for
     * all other entities.
     *
     * @param entity - The entity.
     */
  ItemDrops: (entity: Entity) => boolean
}

/**
 * Gets a list of many default entity filters which can be applied to
 * default state behaviors.
 */
export function EntityFilters (): EntityFiltersHeader {
  return {
    AllEntities: function (): boolean {
      return true
    },

    PlayersOnly: function (entity: Entity): boolean {
      return entity.type === 'player'
    },

    MobsOnly: function (entity: Entity): boolean {
      return entity.type === 'mob'
    },

    ItemDrops: function (entity: Entity): boolean {
      if (entity.objectType === 'Item') { return true }

      if (entity.objectType === 'Arrow') {
        // TODO Check if arrow can be picked up
        // Current NBT parsing is too limited to effectively check.

        return true
      }

      return false
    }
  }
}