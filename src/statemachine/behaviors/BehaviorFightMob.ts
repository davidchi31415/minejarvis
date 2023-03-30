import {StateBehavior, StateMachineTargets} from 'mineflayer-statemachine';
const pvp = require('mineflayer-pvp').plugin;
import {Bot} from 'mineflayer';
import {Item} from 'prismarine-item';
import {Block} from 'prismarine-block';
import {Entity} from 'prismarine-entity';


/**
 * This behavior will attempt to break the target block. If the target block
 * could not be mined for any reason, this behavior fails silently.
 */
export class BehaviorFightMob implements StateBehavior {
  readonly bot: Bot;
  readonly targets: StateMachineTargets;

  stateName = 'mineBlock';
  active = false;
  x?: number;
  y?: number;

  /**
   * Checks if the bot has finished mining the block or not.
   */
  isFinished = false;

  /**
   * Creates a new mine block behavior.
   *
   * @param bot - The bot preforming the mining function.
   * @param targets - The bot targets objects.
   */
  constructor(bot: Bot, targets: StateMachineTargets) {
    this.bot = bot;
    this.targets = targets;
  }

  onStateEntered(): void {
    this.isFinished = false;

    if (this.targets.position === null) {
      this.isFinished = true;
      return;
    }

    const sword = this.bot.inventory
      .items()
      .find(item => item.name.includes('sword'));
    const shield = this.bot.inventory
      .items()
      .find(item => item.name.includes('shield'));
    if (sword !== null) {
      this.bot.equip(sword, 'hand');
    }

    if (shield !== null) {
      setTimeout(() => {
        this.bot.equip(shield, 'off-hand');
      }, 100);
    }

    if (this.targets.entity !== null && this.targets.entity !== undefined) {
      this.bot.pvp.attack(this.targets.entity);
    } else {
      console.log('NO MOB FOUND!');
    }
    this.isFinished = true;
  }

  private getBestTool(block: Block): Item | undefined {
    const items = this.bot.inventory.items();
    for (const i in block.harvestTools) {
      const id = parseInt(i, 10);
      for (const item of items) {
        if (item.type === id) {
          // Ready select
          if (
            this.bot.heldItem !== null &&
            this.bot.heldItem.type === item.type
          ) {
            return undefined;
          }

          return item;
        }
      }
    }

    return undefined;
  }
}
