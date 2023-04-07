// MineJARVIS API
import createRootLayer from "./statemachine/index.js";
import actionTokens from "./statemachine/mappings.js";
// Mineflayer API
import mineflayer from "mineflayer";
import pathfinder_plugin from "mineflayer-pathfinder";
// @ts-ignore
import Vec3 from "vec3";
const { pathfinder } = pathfinder_plugin;
import { plugin as pvp } from "mineflayer-pvp";
import { BotStateMachine, StateMachineWebserver, } from "mineflayer-statemachine";
// LangChain API
import { ChatOpenAI } from "langchain/chat_models";
import { ChatAgent, AgentExecutor } from "langchain/agents";
// Brain API
import { MineTool } from "./brain/tools/index.js";
const MINECRAFT_IP = "10.254.214.217";
const MINECRAFT_PORT = 25565;
const WEBVIEWER_PORT = 3005;
const API_KEY = "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";
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
async function query(message) {
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
}
const bot = mineflayer.createBot({
    host: MINECRAFT_IP,
    username: "Jarvis",
    port: MINECRAFT_PORT,
});
bot.loadPlugin(pathfinder);
bot.loadPlugin(pvp);
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
const data = {
    action: actionTokens.FOLLOW_PLAYER,
    params: {
        // Even things that are not being used must be initialized.
        followRadius: 5,
        fightRadius: 20,
        blockName: "emerald_ore",
        mobName: "Zombie",
        mobType: "Hostile mobs",
        guardPos: new Vec3(0, 0, 0),
        quantity: 0,
    },
    stack: [actionTokens.FOLLOW_PLAYER],
};
const tools = [new MineTool(bot, data)]; //, new GuardTool(bot, data), new FightTool(bot, data), new FollowTool(bot, data), ]
const agent = ChatAgent.fromLLMAndTools(new ChatOpenAI({
    openAIApiKey: API_KEY,
    modelName: "gpt3.5-turbo",
}), tools);
const executor = AgentExecutor.fromAgentAndTools({ agent, tools });
bot.once("spawn", async () => {
    // bot.pathfinder.dontCreateFlow = false; // Let the bot destroy blocks touching water to get to places.
    const rootLayer = createRootLayer(bot, data);
    const stateMachine = new BotStateMachine(bot, rootLayer);
    const webserver = new StateMachineWebserver(bot, stateMachine, WEBVIEWER_PORT);
    webserver.startServer();
});
bot.on("chat", async (username, message) => {
    // if (username !== bot.username) {
    //   const response = await query(message);
    //   console.log(response);
    //   bot.chat(response);
    // }
    if (username === bot.username) {
        const responseG = await executor.run(message);
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
});
// Log errors and kick reasons:
bot.on("kicked", console.log);
bot.on("error", console.log);
//# sourceMappingURL=index.js.map