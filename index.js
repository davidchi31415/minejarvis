const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const pvp = require('mineflayer-pvp').plugin;
const { Configuration, OpenAIApi } = require("openai");
const {
  StateTransition,
  BotStateMachine,
  EntityFilters,
  BehaviorFollowEntity,
  BehaviorLookAtEntity,
  BehaviorGetClosestEntity,
  BehaviorIdle,
  NestedStateMachine
} = require("mineflayer-statemachine");

const MINECRAFT_PORT = 59144;
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
  host: 'localhost', // minecraft server ip
  username: 'Jarvis', // minecraft username
  port: MINECRAFT_PORT
});

bot.loadPlugin(pathfinder);
const GoalFollow = goals.GoalFollow;
let followPlayerDistance = 5;

bot.loadPlugin(pvp);
let botAttackRange = 10;

function followPlayer(distance) {
    const player = bot.players['CatBranchman'];

    if (!player || !player.entity) {
        bot.chat("I can't see you!");
        return;
    }

    const goal = new GoalFollow(player.entity, distance);
    bot.pathfinder.setGoal(goal, true);
}

bot.on('playerCollect', (collector, itemDrop) => {
  if (collector !== bot.entity) return;

  setTimeout(() => {
    const sword = bot.inventory.items().find(item => item.name.includes('sword'));
    if (sword) bot.equip(sword, 'hand');
  }, 150);
})

bot.on('playerCollect', (collector, itemDrop) => {
  if (collector !== bot.entity) return;

  setTimeout(() => {
    const shield = bot.inventory.items().find(item => item.name.includes('shield'));
    if (shield) bot.equip(shield, 'off-hand');
  }, 250);
});

function checkForEnemies() {
  const filter = e => 
    (e.kind?.toUpperCase().startsWith('HOSTILE')) 
    && (e.position.distanceTo(bot.entity.position) < botAttackRange) 
    && (e.mobType !== 'Armor Stand');
  
  const entity = bot.nearestEntity(filter);
  if (entity && (entity !== bot.entity) && checkDistance(entity)) {
    return entity;
  }
  return null;
}

function checkDistance(e) {
  const player = bot.players['CatBranchman'];
  if (!player || !player.entity) {
    return false;
  }
  let dist = e.position.distanceTo(player.entity.position);
  if (dist > 25) {
    return false;
  }
  return true
}

let bored = false;

bot.on('physicTick', async () => {
  // if (bot.pvp.target) {
  //   if (!checkDistance(bot.pvp.target)) {
  //     bot.chat("I've wandered too far. Returning to you.");
  //     bot.pvp.forceStop();
  //     // followPlayer(followPlayerDistance);
  //   }
  //   return;
  // }

  // const enemy = checkForEnemies();
  // if (enemy !== null) {
  //   bot.lookAt(enemy.position.offset(0, enemy.height, 0));
  //   bot.pathfinder.setGoal(null);
  //   bot.pvp.attack(enemy);  
  // } else if (!bored) {
  //   // if (Math.random() - 0.05 <= 0.00001) {
  //   //   bored = true;
  //   //   followPlayer(2);
  //   //   await wait(2500);
  //   //   await boredGesture();
  //   //   followPlayer(followPlayerDistance);
  //   //   bored = false;
  //   // }
  // }
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function happyGesture() {
  for (let i = 1; i <= 8; i++) {
    bot.setControlState("jump", true);
    bot.look(Math.PI * i / 4, 0, false);
    await wait(200);
    bot.setControlState("jump", false);
    await wait(100);
  }
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

bot.on('stoppedAttacking', async () => {
  if (checkForEnemies() === null && bot.pathfinder.goal === null) {
    // followPlayer(followPlayerDistance);
  }
});

bot.once('spawn', async () => {
  // const mcData = require('minecraft-data')(bot.version);
  // const movements = new Movements(bot, mcData);
  // movements.scaffoldingBlocks = [];
  // bot.pathfinder.setMovements(movements);

  // This targets object is used to pass data between different states. It can be left empty.
  const targets = {};

  // Create our states
  const getClosestPlayer = new BehaviorGetClosestEntity(bot, targets, EntityFilters().PlayersOnly);
  const followPlayer = new BehaviorFollowEntity(bot, targets);
  const lookAtPlayer = new BehaviorLookAtEntity(bot, targets);

  // Create our transitions
  const transitions = [

      // We want to start following the player immediately after finding them.
      // Since getClosestPlayer finishes instantly, shouldTransition() should always return true.
      new StateTransition({
          parent: getClosestPlayer,
          child: followPlayer,
          shouldTransition: () => true,
      }),

      // If the distance to the player is less than two blocks, switch from the followPlayer
      // state to the lookAtPlayer state.
      new StateTransition({
          parent: followPlayer,
          child: lookAtPlayer,
          shouldTransition: () => followPlayer.distanceToTarget() < 5,
      }),

      // If the distance to the player is more than two blocks, switch from the lookAtPlayer
      // state to the followPlayer state.
      new StateTransition({
          parent: lookAtPlayer,
          child: followPlayer,
          shouldTransition: () => lookAtPlayer.distanceToTarget() >= 5,
      }),
  ];

  // Now we just wrap our transition list in a nested state machine layer. We want the bot
  // to start on the getClosestPlayer state, so we'll specify that here.
  const rootLayer = new NestedStateMachine(transitions, getClosestPlayer);
  
  // We can start our state machine simply by creating a new instance.
  new BotStateMachine(bot, rootLayer);
});

bot.on('chat', async (username, message) => {
  if (username === bot.username) return;
  const response = await query(message);
  console.log(response);
  bot.chat(response);
  boredGesture();
});

// Log errors and kick reasons:
bot.on('kicked', console.log);
bot.on('error', console.log);