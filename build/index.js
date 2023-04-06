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
// MineJARVIS API
const statemachine_1 = __importDefault(require("./statemachine"));
const mappings_1 = __importDefault(require("./statemachine/mappings"));
// Mineflayer API
const mineflayer_1 = __importDefault(require("mineflayer"));
const mineflayer_pathfinder_1 = __importDefault(require("mineflayer-pathfinder"));
const vec3_1 = require("vec3");
const { pathfinder } = mineflayer_pathfinder_1.default;
const mineflayer_pvp_1 = require("mineflayer-pvp");
const mineflayer_statemachine_1 = require("mineflayer-statemachine");
// LangChain API
const chat_models_1 = require("langchain/chat_models");
const agents_1 = require("langchain/agents");
// Brain API
const tools_1 = require("./brain/tools");
const MINECRAFT_IP = '10.254.214.217';
const MINECRAFT_PORT = 25565;
const WEBVIEWER_PORT = 3005;
const API_KEY = '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';
// const configuration: Configuration = new Configuration({
//   apiKey: API_KEY,
// });
// const openai: OpenAIApi = new OpenAIApi(configuration);
// const messages: any = [
//   {
//     role: 'user',
//     content:
//       "Your name is Jarvis. You are playing Minecraft with a friend named David. \
//     You are in the same Minecraft world as David and are playing at the same time (but not necessarily at the same place). \
//     If possible, limit each message to within 15 words. Be concise. \
//     Here is how to respond to a message.\
//     You have the following four possible action tokens:\
//     * [MINE], mines a block\
//     * [FOLLOW], follows the player\
//     * [GUARD], guards a position against enemies\
//     * [FIGHT], fights a nearby enemy but does not guard a specific position\
//     If you deem it necessary to perform an action, specify that action at the beginning of your response. Then, process with whatever\
//     message you wish to say, after the action token. The following are examples of valid responses:\
//     `[FOLLOW] I will follow you now.`, `[FIGHT] I see the zombies! I will fight them for you.\
//     Note that it is important you always enclose the action token in brackets (but NOT the message after it).",
//   },
// ];
function query(message) {
    return __awaiter(this, void 0, void 0, function* () {
        // messages.push({
        //   role: 'user',
        //   content: message,
        // });
        // const completion = await openai.createChatCompletion({
        //   model: 'gpt-3.5-turbo',
        //   messages: messages,
        // });
        // messages.push(completion.data.choices[0].message);
        // return messages[messages.length - 1].content;
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
const data = {
    action: mappings_1.default.FOLLOW_PLAYER,
    params: {
        // Even things that are not being used must be initialized.
        followRadius: 5,
        fightRadius: 20,
        blockName: 'emerald_ore',
        mobName: 'Zombie',
        mobType: 'Hostile mobs',
        guardPos: new vec3_1.Vec3(0, 0, 0),
        quantity: 0,
    },
    stack: [mappings_1.default.FOLLOW_PLAYER],
};
const tools = [new tools_1.MineTool(bot, data)]; //, new GuardTool(bot, data), new FightTool(bot, data), new FollowTool(bot, data), ]
const agent = agents_1.ChatAgent.fromLLMAndTools(new chat_models_1.ChatOpenAI({
    openAIApiKey: API_KEY,
    modelName: "gpt3.5-turbo"
}), tools);
const executor = agents_1.AgentExecutor.fromAgentAndTools({ agent, tools });
bot.once('spawn', () => __awaiter(void 0, void 0, void 0, function* () {
    // bot.pathfinder.dontCreateFlow = false; // Let the bot destroy blocks touching water to get to places.
    const rootLayer = (0, statemachine_1.default)(bot, data);
    const stateMachine = new mineflayer_statemachine_1.BotStateMachine(bot, rootLayer);
    const webserver = new mineflayer_statemachine_1.StateMachineWebserver(bot, stateMachine, WEBVIEWER_PORT);
    webserver.startServer();
}));
bot.on('chat', (username, message) => __awaiter(void 0, void 0, void 0, function* () {
    // if (username !== bot.username) {
    //   const response = await query(message);
    //   console.log(response);
    //   bot.chat(response);
    // }
    if (username === bot.username) {
        const responseG = yield executor.run(message);
        console.log(responseG);
        /*if (message.split(' ')[0] === '[MINE]') {
          console.log('Attempting to Switch to Mine.');
    
          data.action = actionTokens.IDLE;
          await wait(100);
          data.params.blockName = "emerald_ore";
          data.params.quantity = 2;
          data.action = actionTokens.MINE;
          data.stack.push(actionTokens.MINE);
    
          return;
        }
        if (message.split(' ')[0] === '[FOLLOW]') {
          console.log('Attempting to Switch to Follow.');
    
          data.action = actionTokens.IDLE;
          await wait(100);
          data.params.followRadius = 5;
          data.action = actionTokens.FOLLOW_PLAYER;
    
          return;
        }
        if (message.split(' ')[0] === '[FIGHT]') {
          console.log('Attempting to Switch to Fight.');
    
          data.action = actionTokens.IDLE;
          await wait(100);
          data.params.mobName = 'Zombie'
          data.params.mobType = "Hostile mobs"
          data.params.fightRadius = 20;
          data.params.quantity = 100000;
          data.action = actionTokens.FIGHT;
    
          return;
        }
    
        if (message.split(' ')[0] === '[GUARD]') {
          console.log('Attempting to Switch to Guard.');
          data.action = actionTokens.IDLE;
          await wait(100);
          data.params.mobType = "Hostile mobs"
          data.params.guardPos = bot.entity.position;
          data.params.fightRadius = "10";
          data.action = actionTokens.GUARD;
          return;
        }*/
        return;
    }
}));
// Log errors and kick reasons:
bot.on('kicked', console.log);
bot.on('error', console.log);
