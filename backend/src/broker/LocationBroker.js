import kafka from "kafka-node";

const Producer = kafka.Producer;
const client = new kafka.Client("127.0.0.1:9042");

const kafka_topic = "trackingSessions";
let payloads = [
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

const Consumer = kafka.HighLevelConsumer;
let consumer = new Consumer(
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
consumer.on('error', onErrorConsumerTrackingSessions());


export async function onMessageConsumerTrackingSessions(message) {
    console.log('consumer message');
    console.log(
        'kafka-> ',
        message.value
    );
}

export async function onErrorConsumerTrackingSessions(message) {
    console.log('error', err);
}


