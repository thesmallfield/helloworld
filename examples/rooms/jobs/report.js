import { bookings } from '../bookings.js';

const rooms = new Set(bookings.map((b) => b.room));
process.stdout.write(`rooms report: ${bookings.length} bookings across ${rooms.size} rooms\n`);
for (const b of bookings) {
    process.stdout.write(`${b.slot} ${b.room} ${b.person}\n`);
}
