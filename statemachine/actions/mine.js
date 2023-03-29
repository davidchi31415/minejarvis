import { 
    StateTransition, NestedStateMachine,
    BehaviorIdle, BehaviorMineBlock, 
    BehaviorMoveTo, BehaviorFindBlock
} from 'mineflayer-statemachine';
import mcDataFn from 'minecraft-data';

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function leaveAction(data) {
    await wait(1000)
    data.stack.pop()
    data.action = data.stack[data.stack.length-1]
    console.log("FINISHED")
}
  
function createMineActionState(bot, data) {
    /**
     *  data is passed in from the bot root layer.
     *  
     *      * blockName
     *      * quantity
     */

    const { blockName, quantity } = data.params;

    const mcData = mcDataFn(bot.version);

    const targets = {};

    // Enter and Exit
    const exit = new BehaviorIdle();

    // Mining behavior states
    const findBlockState = new BehaviorFindBlock(bot, targets); // Set the value of targets.position to the block found
    findBlockState.blocks = [ mcData.blocksByName[blockName].id ];

    findBlockState.maxDistance = 100;
    const goToBlockState = new BehaviorMoveTo(bot, targets);
    const mineBlockState = new BehaviorMineBlock(bot, targets);

    const transitions = [
        new StateTransition( // Attempt to find the nearest block
            {
                parent: findBlockState,
                child: goToBlockState,
                shouldTransition: () => {
                    if (targets.position !== null && targets.position !== undefined) return true;
                    return false;
                },
            }
        ),
        new StateTransition( // If block of certain type isn't found then leave 
            {
                parent: findBlockState,
                child: exit,
                shouldTransition: () => {
                    console.log(`[Mine Action] Error: Could not find ${blockName} block`);
                    leaveAction(data)
                    return true;
                },
            }
        ),
        
        new StateTransition(
            {
                parent: goToBlockState,
                child: mineBlockState,
                shouldTransition: () => {;
                    if (goToBlockState.distanceToTarget() <= 1) {
                        return true;
                    }
                    return false;
                },
            }
        ),

        new StateTransition(
            {
                parent: mineBlockState,
                child: exit,
                shouldTransition: () => {
                    if (data.params.quantity <= 1 && mineBlockState.isFinished) {
                        leaveAction(data)
                        return true;
                    }
                    return false;
                },
            }
        ),
        new StateTransition(
            {
                parent: mineBlockState,
                child: findBlockState,
                shouldTransition: () => {
                    if (data.params.quantity > 1 && mineBlockState.isFinished) {
                        setTimeout(() => {  
                            data.params.quantity -= 1;
                            console.log(data.params.quantity); 
                            return true; 
                        }, 1000);
                        return true
                    }
                    return false;
                },
            }
        ),
    ];

    return new NestedStateMachine(transitions, findBlockState, exit);
}


export default createMineActionState;