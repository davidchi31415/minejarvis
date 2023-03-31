"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BehaviorReturnToGuard = void 0;
const mineflayer_pathfinder_1 = require("mineflayer-pathfinder");
/**
 * This behavior will attempt to fight a mob. If the bot has
 * a sword and/or a shield, it will equip them.
 */
class BehaviorReturnToGuard {
    /**
     * Creates a new mine block behavior.
     *
     * @param bot - The bot preforming the mining function.
     * @param targets - The bot targets objects.
     */
    constructor(bot, targets) {
        this.stateName = 'returnToGuard';
        this.active = false;
        /**
         * Checks if the bot has finished mining the block or not.
         */
        this.isFinished = false;
        this.bot = bot;
        this.targets = targets;
    }
    onStateEntered() {
        const mcData = require('minecraft-data')(this.bot.version);
        this.bot.pathfinder.setMovements(new mineflayer_pathfinder_1.Movements(this.bot, mcData));
        this.bot.pathfinder.setGoal(new mineflayer_pathfinder_1.goals.GoalBlock(this.guardPos.x, this.guardPos.y, this.guardPos.z));
        this.isFinished = true;
    }
}
exports.BehaviorReturnToGuard = BehaviorReturnToGuard;
