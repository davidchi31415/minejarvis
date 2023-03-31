"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mineflayer_statemachine_1 = require("mineflayer-statemachine");
const BehaviorGetClosestMob_1 = require("../behaviors/BehaviorGetClosestMob");
const BehaviorFightMob_1 = require("../behaviors/BehaviorFightMob");
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function leaveAction(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield wait(1000);
        data.stack.pop();
        data.action = data.stack[data.stack.length - 1];
        console.log('FINISHED');
    });
}
function createFightActionState(bot, data) {
    /**
     *  data is passed in from the bot root layer.
     *
     *      * mobName
     *      * quantity
     */
    const targets = {};
    // Enter and Exit
    const exit = new mineflayer_statemachine_1.BehaviorIdle();
    // Fighting behavior states
    const setMobState = new mineflayer_statemachine_1.BehaviorIdle();
    const findNearestMobState = new BehaviorGetClosestMob_1.BehaviorGetClosestMob(bot, targets);
    const fightMobState = new BehaviorFightMob_1.BehaviorFightMob(bot, targets);
    const transitions = [
        new mineflayer_statemachine_1.StateTransition({
            parent: setMobState,
            child: findNearestMobState,
            shouldTransition: () => {
                findNearestMobState.mobs = [data.params.mobName];
                return true;
            },
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: findNearestMobState,
            child: fightMobState,
            shouldTransition: () => {
                if (targets.entity) {
                    console.log('TRANSITIONING TO FIGHTING');
                    return true;
                }
                return false;
            },
        }),
        new mineflayer_statemachine_1.StateTransition({
            // If mob of certain type isn't found then leave
            parent: findNearestMobState,
            child: exit,
            shouldTransition: () => {
                console.log(`[Fight Action] Error: Could not find ${data.params.mobName} mob in radius of ${data.params.fightRadius} blocks`);
                leaveAction(data);
                return true;
            },
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: fightMobState,
            child: exit,
            shouldTransition: () => {
                if (data.params.quantity <= 1 && fightMobState.isFinished) {
                    console.log('finished fighting');
                    leaveAction(data);
                    return true;
                }
                return false;
            },
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: fightMobState,
            child: findNearestMobState,
            shouldTransition: () => {
                if (data.params.quantity > 1 && fightMobState.isFinished) {
                    targets.entity = null;
                    console.log('finished fighting');
                    data.params.quantity -= 1;
                    return true;
                }
                return false;
            },
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: fightMobState,
            child: findNearestMobState,
            shouldTransition: () => {
                if (targets.entity.position.distanceTo(bot.entity.position) > 3) {
                    return true;
                }
                return false;
            },
        }),
    ];
    return new mineflayer_statemachine_1.NestedStateMachine(transitions, setMobState, exit);
}
exports.default = createFightActionState;
