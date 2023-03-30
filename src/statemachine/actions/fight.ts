import {
  StateTransition,
  NestedStateMachine,
  BehaviorIdle,
  BehaviorMoveTo,
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

function createFightActionState(bot: Bot, data: any) {
  /**
   *  data is passed in from the bot root layer.
   *
   *      * blockName
   *      * quantity
   */

  const {mobName, quantity} = data.params;

  const targets: any = {};

  // Enter and Exit
  const exit = new BehaviorIdle();

  // Fighting behavior states
  const findNearestMobState = new BehaviorGetClosestMob(bot, targets);
  const goToMobState = new BehaviorMoveTo(bot, targets);
  const fightMobState = new BehaviorFightMob(bot, targets);
  const transitions = [
    new StateTransition({
      // Attempt to find the nearest block
      parent: findNearestMobState,
      child: goToMobState,
      shouldTransition: () => {
        if (targets.entity) {
          console.log('FOUND MOB');
          return true;
        }
        return false;
      },
    }),
    new StateTransition({
      // If block of certain type isn't found then leave
      parent: findNearestMobState,
      child: exit,
      shouldTransition: () => {
        console.log(`[Fight Action] Error: Could not find ${mobName} mob`);
        leaveAction(data);
        return true;
      },
    }),

    new StateTransition({
      parent: goToMobState,
      child: fightMobState,
      shouldTransition: () => {
        if (goToMobState.distanceToTarget() <= 2) {
          console.log('TRANSITIONING TO FIGHTING');
          return true;
        }
        return false;
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
          console.log('finished fighting');
          setTimeout(() => {
            data.params.quantity -= 1;
            return true;
          }, 1000);
          return true;
        }
        return false;
      },
    }),
  ];

  return new NestedStateMachine(transitions, findNearestMobState, exit);
}

export default createFightActionState;
