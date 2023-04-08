import {StateBehavior, StateMachineTargets} from 'mineflayer-statemachine';
import {Bot} from 'mineflayer';
import pkg from 'mineflayer-pathfinder';
const {pathfinder, Movements, goals} = pkg;

/**
 * This behavior will attempt to fight a mob. If the bot has
 * a sword and/or a shield, it will equip them.
 */
export class BehaviorReturnToGuard implements StateBehavior {
  readonly bot: Bot;
  readonly targets: StateMachineTargets;

  stateName = 'returnToGuard';
  active = false;
  x?: number;
  y?: number;

  /**
   * Checks if the bot has finished mining the block or not.
   */
  isFinished = false;
  guardPos:any;

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
    const mcData = require('minecraft-data')(this.bot.version)
    this.bot.pathfinder.setMovements(new Movements(this.bot, mcData))
    this.bot.pathfinder.setGoal(new goals.GoalBlock(this.guardPos.x, this.guardPos.y, this.guardPos.z))
    this.isFinished = true;
  }
}