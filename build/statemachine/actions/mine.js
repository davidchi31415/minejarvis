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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mineflayer_statemachine_1 = require("mineflayer-statemachine");
const minecraft_data_1 = __importDefault(require("minecraft-data"));
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
function createMineActionState(bot, data) {
    /**
     *  data is passed in from the bot root layer.
     *
     *      * blockName
     *      * quantity
     */
    const { blockName, quantity } = data.params;
    const mcData = (0, minecraft_data_1.default)(bot.version);
    const targets = {};
    // Enter and Exit
    const exit = new mineflayer_statemachine_1.BehaviorIdle();
    // Mining behavior states
    const findBlockState = new mineflayer_statemachine_1.BehaviorFindBlock(bot, targets); // Set the value of targets.position to the block found
    const goToBlockState = new mineflayer_statemachine_1.BehaviorMoveTo(bot, targets);
    const mineBlockState = new mineflayer_statemachine_1.BehaviorMineBlock(bot, targets);
    const setBlockState = new mineflayer_statemachine_1.BehaviorIdle();
    const transitions = [
        new mineflayer_statemachine_1.StateTransition({
            parent: setBlockState,
            child: findBlockState,
            shouldTransition: () => {
                findBlockState.blocks = [
                    mcData.blocksByName[data.params.blockName].id,
                ];
                findBlockState.maxDistance = 100;
                return true;
            },
        }),
        new mineflayer_statemachine_1.StateTransition({
            // Attempt to find the nearest block
            parent: findBlockState,
            child: goToBlockState,
            shouldTransition: () => {
                if (targets.position !== null && targets.position !== undefined)
                    return true;
                return false;
            },
        }),
        new mineflayer_statemachine_1.StateTransition({
            // If block of certain type isn't found then leave
            parent: findBlockState,
            child: exit,
            shouldTransition: () => {
                console.log(`[Mine Action] Error: Could not find ${blockName} block`);
                leaveAction(data);
                return true;
            },
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: goToBlockState,
            child: mineBlockState,
            shouldTransition: () => {
                if (goToBlockState.distanceToTarget() <= 1) {
                    return true;
                }
                return false;
            },
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: mineBlockState,
            child: exit,
            shouldTransition: () => {
                if (data.params.quantity <= 1 && mineBlockState.isFinished) {
                    leaveAction(data);
                    return true;
                }
                return false;
            },
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: mineBlockState,
            child: findBlockState,
            shouldTransition: () => {
                if (data.params.quantity > 1 && mineBlockState.isFinished) {
                    setTimeout(() => {
                        data.params.quantity -= 1;
                        console.log(data.params.quantity);
                        return true;
                    }, 1000);
                    return true;
                }
                return false;
            },
        }),
    ];
    return new mineflayer_statemachine_1.NestedStateMachine(transitions, setBlockState, exit);
}
exports.default = createMineActionState;
