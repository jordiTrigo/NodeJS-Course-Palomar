const EventEmitter = require('events');

const emitter = new EventEmitter();

/* Event 1 */

emitter.on('eventEmmited', () => {
    console.log('An event has occurred! ....');
})

emitter.emit('eventEmmited');

/* Event 2 */

emitter.on('eventWithArgument', (arg) => {
    console.log('An event with the next arguments has occurred! ...' + arg.id + ' ' + arg.number);
})

emitter.emit('eventWithArgument', {id: 1, number: 24});