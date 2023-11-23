#!/usr/bin/env node
require('dotenv/config');

require('amqplib/callback_api').connect(process.env.AMQP_URL, (error, conn) => {
    if (error) throw error;
    conn.createChannel((error, channel) => {
        if (error) throw error;
        const queue = process.env.AMQP_QUEUE;
        channel.assertQueue(queue, { durable: false });
        channel.prefetch(1);
        console.log(
            ' [*] Waiting for messages in %s. To exit press CTRL+C',
            queue,
        );
        channel.consume(
            queue,
            function (msg) {
                console.log(' [x] Received %s', msg.content.toString());
            },
            { noAck: true },
        );
    });
});
