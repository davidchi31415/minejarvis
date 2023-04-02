import {
    StateTransition,
    NestedStateMachine,
    BehaviorIdle,
  } from 'mineflayer-statemachine';
  import {BehaviorGetClosestMob} from '../behaviors/BehaviorGetClosestMob';
  import {BehaviorFightMob} from '../behaviors/BehaviorFightMob';
  import {Bot} from 'mineflayer';
import { BehaviorReturnToGuard } from '../behaviors/BehaviorReturnToGuard';
  
  function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function leaveAction(data: any) {
    await wait(1000);
    data.stack.pop();
    data.action = data.stack[data.stack.length - 1];
    console.log('FINISHED');
  }
  
    export function createGuardActionState(bot: Bot, data: any) {
    /**
     *  data is passed in from the bot root layer.
     *
     *      * mobType
     *      * guardRadius
     *      * location
     */
  
    const targets: any = {};
  
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
  
