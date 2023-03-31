import mineflayer from 'mineflayer';
import pathfinder_plugin from 'mineflayer-pathfinder';
import {Vec3} from 'vec3'
const {pathfinder} = pathfinder_plugin;
import {plugin as pvp} from 'mineflayer-pvp';

import {BotStateMachine, StateMachineWebserver} from 'mineflayer-statemachine';
import createRootLayer from './statemachine/index.js';
import actionTokens from './statemachine/mappings.js';
import {Configuration, OpenAIApi} from 'openai';

const MINECRAFT_IP = '10.254.214.217';
const MINECRAFT_PORT = 25565;
const WEBVIEWER_PORT = 3005;
const API_KEY = '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';

const configuration = new Configuration({
  apiKey: API_KEY,
});
const openai = new OpenAIApi(configuration);

const messages : any = [
  {
    role: 'user',
    content:
      "Rules for response: \
    * Your name is Jarvis. \
    * You are playing Minecraft with a friend named David. \
    * You speak using informal language. For example, use 'k' and 'alright' instead of 'okay' and 'all right.' Use slang terms like 'bro' frequently. \
    * You use abbreviations and simplified spelling, and you do not capitalize the first word of each sentence. \
    * You are in the same Minecraft world as David and are playing at the same time (but not necessarily at the same place). \
    * If possible, limit each message to within 15 words. Be concise.",
  },
];

async function query(message: string) {
  messages.push({
    role: 'user',
    content: message,
  });
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: messages,
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
bot.loadPlugin(pvp);

function wait(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function boredGesture() {
  const player = bot.players['CatBranchman'];
  if (player?.entity) {
    bot.lookAt(player.entity.position);
    await wait(500);

    const numSwings = Math.floor(Math.random() * 20) + 1;
    let sneak = false;
    for (let i = 0; i < numSwings; i++) {
      if (!sneak) {
        sneak = Math.random() < 0.5;
        if (sneak) bot.setControlState('sneak', true);
      }
      bot.swingArm('right');
      await wait(150);
      bot.lookAt(player.entity.position);
      if (sneak) {
        if (Math.random() < 0.5) sneak = false;
        if (!sneak) bot.setControlState('sneak', false);
      }
    }
    bot.setControlState('sneak', false);
  }
}

const data = {
  action: actionTokens.FOLLOW_PLAYER,
  params: {
    // Even things that are not being used must be initialized.
    followRadius: 5,
    fightRadius : 20,
    blockName: 'emerald_ore',
    mobName : 'Zombie',
    mobType : 'Hostile',
    guardPos : new Vec3(0, 0, 0),
    quantity: 0,

  },
  stack: [actionTokens.FOLLOW_PLAYER],
};

bot.once('spawn', async () => {
  // bot.pathfinder.dontCreateFlow = false; // Let the bot destroy blocks touching water to get to places.

  const rootLayer = createRootLayer(bot, data);
  const stateMachine = new BotStateMachine(bot, rootLayer);

  const webserver = new StateMachineWebserver(
    bot,
    stateMachine,
    WEBVIEWER_PORT
  );
  webserver.startServer();
});

// bot.on('chat', async (username, message) => {
//   if (username === bot.username) return;
//   const response = await query(message);
//   console.log(response);
//   bot.chat(response);
//   await boredGesture();
// 2});

bot.on('chat', async (username: string, message: string) => {
  if (username === bot.username) return;

  if (message.split(' ')[0] === '[MINE]') {
    console.log('Attempting to Switch to Mine.');

    data.action = actionTokens.IDLE;
    await wait(100);
    data.params.blockName = message.split(' ')[1];
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
    data.params.mobName = message.split(' ')[1]
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
    data.params.fightRadius = parseInt(message.split(' ')[1]);
    data.action = actionTokens.GUARD;
    return;
  }

});

// Log errors and kick reasons:
bot.on('kicked', console.log);
bot.on('error', console.log);
