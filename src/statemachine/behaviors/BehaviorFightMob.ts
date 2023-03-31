import {StateBehavior, StateMachineTargets} from 'mineflayer-statemachine';
import {Bot} from 'mineflayer';


/**
 * This behavior will attempt to fight a mob. If the bot has
 * a sword and/or a shield, it will equip them.
 */
export class BehaviorFightMob implements StateBehavior {
  readonly bot: Bot;
  readonly targets: StateMachineTargets;

  stateName = 'fightMob';
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

    if (this.targets.entity === null) {
      this.isFinished = true;
      return;
    }

    const sword = this.bot.inventory
      .items()
      .find(item => item.name.includes('sword'));
    if (sword) {
      this.bot.equip(sword, 'hand');
    }

    const shield = this.bot.inventory
      .items()
      .find(item => item.name.includes('shield'));
    if (shield) {
      setTimeout(() => {
        this.bot.equip(shield, 'off-hand');
      }, 100);
    }

    if (this.targets.entity) {
      this.bot.pvp.attack(this.targets.entity);
    } else {
      console.log('NO MOB FOUND!');
    }
    this.isFinished = true;
  }
}