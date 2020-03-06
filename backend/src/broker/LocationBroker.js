import kafka from "kafka-node";

const Producer = kafka.Producer;
const client = new kafka.KafkaClient({kafkaHost: "127.0.0.1:9042"});

const kafka_topic = "trackingSessions";
const payloads = [
    {
        topic: "trackingSessions",
        messages: "hello world"
    }
];

const producer = new Producer(client);
producer.on('ready', async function() {
    let push_status = producer.send(payloads, (err, data) => {
        if (err) {
            console.log('[kafka-producer -> '+kafka_topic+']: broker update failed');
        } else {
            console.log('[kafka-producer -> '+kafka_topic+']: broker update success');
        }
    });
});

producer.on('error', function(err) {
    console.log(err);
    console.log('[kafka-producer -> '+kafka_topic+']: connection errored');
    throw err;
});

const Consumer = kafka.Consumer;
const consumer = new Consumer(
    client,
    [{ topic: "trackingSessions", partition: 0 }],
    {
        autoCommit: false,
        fetchMaxWaitMs: 2000,
        fetchMaxBytes: 1024 * 1024,
        encoding: 'utf8',
        fromOffset: false
    }
);

consumer.on('message', onMessageConsumerTrackingSessions);
consumer.on('error', onErrorConsumerTrackingSessions);

// TODO: NEED to figure out how to make this stateless while avoiding duplicate sends to same client
// could store res in MongoDb but need to consider query time and how to remove it later (scheduled task),
// duplicate send handling might have to be done on a separate component OR extract the whole consumer
// code to another scalable server with a load balancer server to ensure duplicate sends are managed
export const subscribedConnections = new Map();  // trackingCode: [{res, subscribedAt: new Date()}]
// TODO: find a way to uniquely identify a res so we don't send to same client

export async function onMessageConsumerTrackingSessions(message) {
    console.log('consumer message');
    console.log(
        'kafka-> ',
        message.value
    );
    if (subscribedConnections.get(message.value)) {
        const subscribers = subscribedConnections.get(message.value);
        for(let i = 0; i < subscribers.length; i++) {
            const {res, subscribedAt} = subscribers[i];
            res.sseSend(message.value);
        }
    }
}

export async function onErrorConsumerTrackingSessions(message) {
    console.log('error', err);
}


