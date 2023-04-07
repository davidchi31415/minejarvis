import { plugin as pvpPlugin } from 'mineflayer-pvp';
/**
 * Gets the closest entity to the bot and sets it as the entity
 * target. This behavior executes once right when the behavior
 * is entered, and should transition out immediately.
 */
export class BehaviorGetClosestMob {
    constructor(bot, targets) {
        this.stateName = 'getClosestEntity';
        this.active = false;
        this.mobs = [];
        this.mobType = "";
        this.bot = bot;
        this.targets = targets;
        this.bot.loadPlugin(pvpPlugin);
    }
    onStateEntered() {
        this.targets.entity = this.getClosestMob() ?? undefined;
        if (this.targets.entity && this.bot.entity.position.distanceTo(this.targets.entity.position) < this.radius) {
            this.targets.position = this.targets.entity.position;
        }
        else {
            this.targets.entity = undefined;
        }
    }
    /**
     * Gets the closest entity to the bot, filtering entities as needed.
     *
     * @returns The closest entity, or null if there are none.
     */
    getClosestMob() {
        let mobFilter = null;
        console.log(this.mobType);
        console.log(this.mobs[0]);
        if (this.mobType != null && this.mobType != undefined) {
            console.log(this.mobType);
            mobFilter = (e) => e.kind === this.mobType;
        }
        else if (this.mobs[0] != null && this.mobs[0] != undefined) {
            mobFilter = (e) => e.mobType === this.mobs[0];
        }
        else {
            mobFilter = (e) => e.mobType?.toUpperCase() === 'ZOMBIE';
        }
        const mob = this.bot.nearestEntity(mobFilter);
        return mob;
    }
}
/**
 * Gets a list of many default entity filters which can be applied to
 * default state behaviors.
 */
export function EntityFilters() {
    return {
        AllEntities: function () {
            return true;
        },
        PlayersOnly: function (entity) {
            return entity.type === 'player';
        },
        MobsOnly: function (entity) {
            return entity.type === 'mob';
        },
        ItemDrops: function (entity) {
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
//# sourceMappingURL=BehaviorGetClosestMob.js.map