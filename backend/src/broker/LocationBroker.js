import kafka from "kafka-node";
import {log} from "../util/log";
import {getBrokerHost, getBrokerMainTopic, getBrokerPort} from "../util/config";

const Producer = kafka.Producer;
const client = new kafka.KafkaClient({kafkaHost: getBrokerHost() + ":" + getBrokerPort()});

const kafka_topic = getBrokerMainTopic();
const payloads = [
    {
        topic: kafka_topic,
        messages: "hello world"
    }
];

export const producer = new Producer(client);
producer.on('ready', async function() {
    log.info(`Kafka producer ready on ${getBrokerHost()}:${getBrokerPort()} main_topic='${kafka_topic}'`);
    // let push_status = producer.send(payloads, (err, data) => {
    //     if (err) {
    //         console.log('[kafka-producer -> '+kafka_topic+']: broker update failed');
    //     } else {
    //         console.log('[kafka-producer -> '+kafka_topic+']: broker update success');
    //     }
    // });
});

producer.on('error', function(err) {  //TODO: handle retries from here
    console.log(err);
    console.log('[kafka-producer -> '+kafka_topic+']: connection errored');
    // throw err;
});

const Consumer = kafka.Consumer;
const consumer = new Consumer(
    client,
    [{ topic: kafka_topic, partition: 0 }],
    {
        autoCommit: true, // TODO: test and try out
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
    console.log('consumer message ', message);
    console.log(
        'kafka-> ',
        message.value
    );
    const json = JSON.parse(message.value);
    console.log("subscribedConnections.get(json.trackingCode) ", subscribedConnections.get(json.trackingCode));
    if (subscribedConnections.get(json.trackingCode)) {
        const subscribers = subscribedConnections.get(json.trackingCode);
        for(let i = 0; i < subscribers.length; i++) {
            const {res, subscribedAt} = subscribers[i];
            console.log("PUSHING TO CONNECTION at " + subscribedAt);
            res.sseSend(json);
        }
    }
}

export async function onErrorConsumerTrackingSessions(message) {
    console.log('onErrorConsumerTrackingSessions error', message);
}


