const { Kafka } = require('kafkajs');
require('dotenv').config();

const { BROKERS, CLIENT, SECURITY, KAFKA_USERNAME, KAFKA_PASSWORD } = process.env
const myArgs = process.argv.slice(2); // node producer.js stocks ko 125
const [TOPIC, KEY, VALUE] = myArgs;

// instantiating the KafkaJS client by pointing it towards at least one broker:
const config = {
  clientId: CLIENT,
  brokers: BROKERS.split(" ")
};

if (SECURITY === 'SASL-plain') {
  config.sasl = {
    mechanism: 'plain',
    username: KAFKA_USERNAME,
    password: KAFKA_PASSWORD
  };
}

const kafka = new Kafka(config);

// create a producer to produce a message
const producer = kafka.producer();

const producerStart = async() => {
  await producer.connect();
  await producer.send({
    topic: TOPIC,
    messages: [
      { key: KEY, value: VALUE },
    ],
  });

  await producer.disconnect();
};

producerStart();