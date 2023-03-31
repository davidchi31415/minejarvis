import {
  StateTransition,
  NestedStateMachine,
  BehaviorIdle,
} from 'mineflayer-statemachine';
import {BehaviorGetClosestMob} from '../behaviors/BehaviorGetClosestMob';
import {BehaviorFightMob} from '../behaviors/BehaviorFightMob';
import {Bot} from 'mineflayer';

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function leaveAction(data: any) {
  await wait(1000);
  data.stack.pop();
  data.action = data.stack[data.stack.length - 1];
  console.log('FINISHED');
}

export function createFightActionState(bot: Bot, data: any) {
  /**
   *  data is passed in from the bot root layer.
   *
   *      * mobName
   *      * quantity
   */

  const targets: any = {};

  // Enter and Exit
  const exit = new BehaviorIdle();

  // Fighting behavior states
  const setMobState = new BehaviorIdle();
  const findNearestMobState = new BehaviorGetClosestMob(bot, targets);
  const fightMobState = new BehaviorFightMob(bot, targets);
  const transitions = [

    new StateTransition({
      parent: setMobState, 
      child: findNearestMobState, 
      shouldTransition: () => {
        findNearestMobState.mobs = [data.params.mobName];
        return true;
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
      // If mob of certain type isn't found then leave
      parent: findNearestMobState,
      child: exit,
      shouldTransition: () => {
          console.log(`[Fight Action] Error: Could not find ${data.params.mobName} mob in radius of ${data.params.fightRadius} blocks`);
          leaveAction(data);
          return true;
      },
    }),

    new StateTransition({
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
    new StateTransition({
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

    new StateTransition({
      parent: fightMobState,
      child: findNearestMobState,
      shouldTransition: () => {
        if (targets.entity.position.distanceTo(bot.entity.position) > 3) {
          targets.entity = null;
          return true;
        }
        return false;
      },
    }),
  ];

  return new NestedStateMachine(transitions, setMobState, exit);
}
