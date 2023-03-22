import mineflayer from 'mineflayer';
import { StateTransition, BotStateMachine,  } from 'mineflayer-statemachine';

const MINECRAFT_PORT = 58000;

const bot = mineflayer.createBot({
    host: 'localhost', // minecraft server ip
    username: 'Jarvis', // minecraft username
    port: MINECRAFT_PORT
});