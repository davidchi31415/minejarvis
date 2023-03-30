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
const mineflayer_1 = __importDefault(require("mineflayer"));
const mineflayer_pathfinder_1 = __importDefault(require("mineflayer-pathfinder"));
const { pathfinder } = mineflayer_pathfinder_1.default;
const mineflayer_pvp_1 = require("mineflayer-pvp");
const mineflayer_statemachine_1 = require("mineflayer-statemachine");
const index_js_1 = __importDefault(require("./statemachine/index.js"));
const mappings_js_1 = __importDefault(require("./statemachine/mappings.js"));
const openai_1 = require("openai");
const MINECRAFT_IP = '10.254.214.217';
const MINECRAFT_PORT = 25565;
const WEBVIEWER_PORT = 3005;
const API_KEY = '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';
const configuration = new openai_1.Configuration({
    apiKey: API_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
const messages = [
    {
        role: 'user',
        content: "Rules for response: \
    * Your name is Jarvis. \
    * You are playing Minecraft with a friend named David. \
    * You speak using informal language. For example, use 'k' and 'alright' instead of 'okay' and 'all right.' Use slang terms like 'bro' frequently. \
    * You use abbreviations and simplified spelling, and you do not capitalize the first word of each sentence. \
    * You are in the same Minecraft world as David and are playing at the same time (but not necessarily at the same place). \
    * If possible, limit each message to within 15 words. Be concise.",
    },
];
function query(message) {
    return __awaiter(this, void 0, void 0, function* () {
        messages.push({
            role: 'user',
            content: message,
        });
        const completion = yield openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: messages,
        });
        messages.push(completion.data.choices[0].message);
        return messages[messages.length - 1].content;
    });
}
const bot = mineflayer_1.default.createBot({
    host: MINECRAFT_IP,
    username: 'Jarvis',
    port: MINECRAFT_PORT,
});
bot.loadPlugin(pathfinder);
bot.loadPlugin(mineflayer_pvp_1.plugin);
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function boredGesture() {
    return __awaiter(this, void 0, void 0, function* () {
        const player = bot.players['CatBranchman'];
        if (player === null || player === void 0 ? void 0 : player.entity) {
            bot.lookAt(player.entity.position);
            yield wait(500);
            const numSwings = Math.floor(Math.random() * 20) + 1;
            let sneak = false;
            for (let i = 0; i < numSwings; i++) {
                if (!sneak) {
                    sneak = Math.random() < 0.5;
                    if (sneak)
                        bot.setControlState('sneak', true);
                }
                bot.swingArm('right');
                yield wait(150);
                bot.lookAt(player.entity.position);
                if (sneak) {
                    if (Math.random() < 0.5)
                        sneak = false;
                    if (!sneak)
                        bot.setControlState('sneak', false);
                }
            }
            bot.setControlState('sneak', false);
        }
    });
}
const data = {
    action: mappings_js_1.default.FOLLOW_PLAYER,
    params: {
        // Even things that are not being used must be initialized.
        followRadius: 5,
        blockName: 'emerald_ore',
        mobName: 'Zombie',
        quantity: 0,
    },
    stack: [mappings_js_1.default.FOLLOW_PLAYER],
};
bot.once('spawn', () => __awaiter(void 0, void 0, void 0, function* () {
    // bot.pathfinder.dontCreateFlow = false; // Let the bot destroy blocks touching water to get to places.
    const rootLayer = (0, index_js_1.default)(bot, data);
    const stateMachine = new mineflayer_statemachine_1.BotStateMachine(bot, rootLayer);
    const webserver = new mineflayer_statemachine_1.StateMachineWebserver(bot, stateMachine, WEBVIEWER_PORT);
    webserver.startServer();
}));
// bot.on('chat', async (username, message) => {
//   if (username === bot.username) return;
//   const response = await query(message);
//   console.log(response);
//   bot.chat(response);
//   await boredGesture();
// 2});
bot.on('chat', (username, message) => __awaiter(void 0, void 0, void 0, function* () {
    if (username === bot.username)
        return;
    if (message.split(' ')[0] === '[MINE]') {
        console.log('Attempting to Switch to Mine.');
        data.action = mappings_js_1.default.IDLE;
        yield wait(100);
        data.params.blockName = message.split(' ')[1];
        data.params.quantity = 2;
        data.action = mappings_js_1.default.MINE;
        data.stack.push(mappings_js_1.default.MINE);
        return;
    }
    if (message.split(' ')[0] === '[FOLLOW]') {
        console.log('Attempting to Switch to Follow.');
        data.action = mappings_js_1.default.IDLE;
        yield wait(100);
        data.params.followRadius = 5;
        data.action = mappings_js_1.default.FOLLOW_PLAYER;
        return;
    }
    if (message.split(' ')[0] === '[FIGHT]') {
        console.log('Attempting to Switch to Fight.');
        data.action = mappings_js_1.default.IDLE;
        yield wait(100);
        data.params.mobName = message.split(' ')[1];
        data.params.followRadius = 5;
        data.params.quantity = 2;
        data.action = mappings_js_1.default.FIGHT;
        return;
    }
}));
// Log errors and kick reasons:
bot.on('kicked', console.log);
bot.on('error', console.log);
