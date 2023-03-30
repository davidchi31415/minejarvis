"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityFilters = exports.BehaviorGetClosestMob = void 0;
const mineflayer_pvp_1 = require("mineflayer-pvp");
/**
 * Gets the closest entity to the bot and sets it as the entity
 * target. This behavior executes once right when the behavior
 * is entered, and should transition out immediately.
 */
class BehaviorGetClosestMob {
    constructor(bot, targets) {
        this.stateName = 'getClosestEntity';
        this.active = false;
        this.mobs = [];
        this.bot = bot;
        this.targets = targets;
        this.bot.loadPlugin(mineflayer_pvp_1.plugin);
    }
    onStateEntered() {
        var _a;
        this.targets.entity = (_a = this.getClosestMob()) !== null && _a !== void 0 ? _a : undefined;
        if (this.targets.entity) {
            this.targets.position = this.targets.entity.position;
        }
    }
    /**
     * Gets the closest entity to the bot, filtering entities as needed.
     *
     * @returns The closest entity, or null if there are none.
     */
    getClosestMob() {
        const mobFilter = (e) => true; // e.mobType?.toUpperCase() === 'ZOMBIE';
        const mob = this.bot.nearestEntity(mobFilter);
        return mob;
    }
}
exports.BehaviorGetClosestMob = BehaviorGetClosestMob;
/**
 * Gets a list of many default entity filters which can be applied to
 * default state behaviors.
 */
function EntityFilters() {
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
exports.EntityFilters = EntityFilters;
