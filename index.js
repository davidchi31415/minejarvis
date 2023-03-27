import mineflayer from 'mineflayer';
import pathfinder_plugin from 'mineflayer-pathfinder';
const { pathfinder, Movements, goals } = pathfinder_plugin;
import {
  StateTransition,
  BotStateMachine,
  EntityFilters,
  BehaviorFollowEntity,
  BehaviorLookAtEntity,
  BehaviorGetClosestEntity,
  BehaviorIdle,
  NestedStateMachine,
  StateMachineWebserver
} from "mineflayer-statemachine";
import actions from './actions/index.js';
import { Configuration, OpenAIApi } from 'openai';

const MINECRAFT_IP = '10.254.214.217';
const MINECRAFT_PORT = 25565;
const WEBVIEWER_PORT = 3000;
const API_KEY = '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';

const configuration = new Configuration({
  apiKey: API_KEY,
});
const openai = new OpenAIApi(configuration);

const messages = [
  {"role": "user", "content": 
    "Rules for response: \
    * Your name is Jarvis. \
    * You are playing Minecraft with a friend named David. \
    * You speak using informal language. For example, use 'k' and 'alright' instead of 'okay' and 'all right.' Use slang terms like 'bro' frequently. \
    * You use abbreviations and simplified spelling, and you do not capitalize the first word of each sentence. \
    * You are in the same Minecraft world as David and are playing at the same time (but not necessarily at the same place). \
    * If possible, limit each message to within 15 words. Be concise."
  },
];

async function query(message) {
  messages.push({
    "role": "user",
    "content": message
  });
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages
  });
  messages.push(completion.data.choices[0].message);
  return messages[messages.length - 1].content;
}

const bot = mineflayer.createBot({
  host: MINECRAFT_IP, // minecraft server ip
  username: 'Jarvis', // minecraft username
  port: MINECRAFT_PORT,
});

bot.loadPlugin(pathfinder);

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function boredGesture() {
  const player = bot.players['CatBranchman'];
  if (player?.entity) {
    bot.lookAt(player.entity.position);
    await wait(500);

    let numSwings = Math.floor(Math.random() * 20) + 1;
    let sneak = false;
    for (let i = 0; i < numSwings; i++) {
      if (!sneak) {
        sneak = Math.random() < 0.5;
        if (sneak) bot.setControlState("sneak", true);
      }
      bot.swingArm('right');
      await wait(150);
      bot.lookAt(player.entity.position);
      if (sneak) {
        if (Math.random() < 0.5) sneak = false;
        if (!sneak) bot.setControlState("sneak", false);
      }
    }
    bot.setControlState("sneak", false);
  }
}
 
bot.once('spawn', async () => {

  bot.pathfinder.dontCreateFlow = false; // Let the bot destroy blocks touching water to get to places.
    
  const rootLayer = actions.createMineActionState(bot, "diamond_ore", 10);

  // We can start our state machine simply by creating a new instance.
  const stateMachine = new BotStateMachine(bot, rootLayer);

  const webserver = new StateMachineWebserver(bot, stateMachine, WEBVIEWER_PORT);
  webserver.startServer();
  
});

bot.on('chat', async (username, message) => {
  if (username === bot.username) return;
  const response = await query(message);
  console.log(response);
  bot.chat(response);
  await boredGesture();
});

// Log errors and kick reasons:
bot.on('kicked', console.log);
bot.on('error', console.log);