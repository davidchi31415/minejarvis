import actionStates from './actions/index.js';
import actionTokens from './mappings.js';
import {
  StateTransition,
  NestedStateMachine,
  BehaviorIdle,
} from 'mineflayer-statemachine';
import {Bot} from 'mineflayer';

function createRootLayer(bot: Bot, data: any) {
  /**
   * data is an object containing two attributes:
   *      action:
   *          This tells the state machine what action to transition to.
   *          It is an integer token, such as actionTokens.MINE.
   *      params:
   *          This object depends on the action to be performed. It is the
   *          info needed to carry out a task such as mining (i.e., what block?).
   *          See the individual action machines to see what parameters should
   *          look like.
   */

  const idleActionState = new BehaviorIdle();

  const followActionState = actionStates.createFollowPlayerActionState(
    bot,
    data
  );
  const mineActionState = actionStates.createMineActionState(bot, data);
  const fightActionState = actionStates.createFightActionState(bot, data);

  const idleToActionTransitions = [
    new StateTransition({
      parent: idleActionState,
      child: followActionState,
      shouldTransition: () => data.action === actionTokens.FOLLOW_PLAYER,
    }),
    new StateTransition({
      parent: idleActionState,
      child: mineActionState,
      shouldTransition: () => data.action === actionTokens.MINE,
    }),
    new StateTransition({
      parent: idleActionState,
      child: fightActionState,
      shouldTransition: () => data.action === actionTokens.FIGHT,
    }),
  ];

  const actionToIdleTransitions = [
    new StateTransition({
      parent: followActionState,
      child: idleActionState,
      shouldTransition: () => data.action !== actionTokens.FOLLOW_PLAYER,
    }),
    new StateTransition({
      parent: mineActionState,
      child: idleActionState,
      shouldTransition: () => data.action !== actionTokens.MINE,
    }),
    new StateTransition({
      parent: fightActionState,
      child: idleActionState,
      shouldTransition: () => data.action !== actionTokens.FIGHT,
    }),
  ];

  const transitions = [...idleToActionTransitions, ...actionToIdleTransitions];

  return new NestedStateMachine(transitions, idleActionState);
}

export default createRootLayer;
