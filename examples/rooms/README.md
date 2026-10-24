# rooms (project `rooms`)

Tiny room-booking app that shares things with other apps. `GET /api/orders` returns the bookings of the signed-in
person (or all of them for a machine call). The `report` job prints a summary.

    cd examples/rooms && sf deploy

Then tick `helloworld` in rooms' Shared tab in the console. Exports: `orders.read` and `report`.
