"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BehaviorFightMob = void 0;
/**
 * This behavior will attempt to fight a mob. If the bot has
 * a sword and/or a shield, it will equip them.
 */
class BehaviorFightMob {
    /**
     * Creates a new mine block behavior.
     *
     * @param bot - The bot preforming the mining function.
     * @param targets - The bot targets objects.
     */
    constructor(bot, targets) {
        this.stateName = 'fightMob';
        this.active = false;
        /**
         * Checks if the bot has finished mining the block or not.
         */
        this.isFinished = false;
        this.bot = bot;
        this.targets = targets;
    }
    onStateEntered() {
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
        }
        else {
            console.log('NO MOB FOUND!');
        }
        this.isFinished = true;
    }
}
exports.BehaviorFightMob = BehaviorFightMob;
