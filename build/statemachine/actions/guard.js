var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { StateTransition, NestedStateMachine, BehaviorIdle, } from 'mineflayer-statemachine';
import { BehaviorGetClosestMob } from '../behaviors/BehaviorGetClosestMob.js';
import { BehaviorFightMob } from '../behaviors/BehaviorFightMob.js';
import { BehaviorReturnToGuard } from '../behaviors/BehaviorReturnToGuard.js';
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
export function createGuardActionState(bot, data) {
    /**
     *  data is passed in from the bot root layer.
     *
     *      * mobType
     *      * guardRadius
     *      * location
     */
    const targets = {};
    // Enter and Exit
    const exit = new BehaviorIdle();
    // Fighting behavior states
    const setGuardState = new BehaviorIdle();
    const returnState = new BehaviorReturnToGuard(bot, targets);
    const findNearestMobState = new BehaviorGetClosestMob(bot, targets);
    const fightMobState = new BehaviorFightMob(bot, targets);
    const transitions = [
        new StateTransition({
            parent: setGuardState,
            child: returnState,
            shouldTransition: () => {
                returnState.guardPos = data.params.guardPos;
                findNearestMobState.radius = data.params.fightRadius;
                findNearestMobState.mobType = data.params.mobType;
                return true;
            },
        }),
        new StateTransition({
            parent: returnState,
            child: findNearestMobState,
            shouldTransition: () => {
                if (returnState.isFinished) {
                    console.log('Fighting');
                    return true;
                }
                return false;
            },
        }),
        new StateTransition({
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
        new StateTransition({
            // If mob of certain type isn't found then return to guarding position
            parent: findNearestMobState,
            child: returnState,
            shouldTransition: () => {
                if (!targets.entity)
                    return true;
                return false;
            },
        }),
        new StateTransition({
            parent: fightMobState,
            child: findNearestMobState,
            shouldTransition: () => {
                if (targets.entity.position.distanceTo(bot.entity.position) > 3 || fightMobState.isFinished) {
                    targets.entity = null;
                    return true;
                }
                return false;
            },
        }),
    ];
    return new NestedStateMachine(transitions, setGuardState, exit);
}
export default createGuardActionState;
