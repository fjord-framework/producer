const { Kafka } = require('kafkajs');
require('dotenv').config();

const { BROKERS, CLIENT, SECURITY, KAFKA_USERNAME, KAFKA_PASSWORD } = process.env
const myArgs = process.argv.slice(2);
let [topic, numPerSecond, batch] = myArgs; // node interval.js stocks 10

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

const BATCH_ID = batch ? batch : Date.now();

function populate(num) {
  const m = [];
  let i = 0;
  let key, value;
  while (i < num) {
    key = String(1 + Math.floor(Math.random() * 10));
    value = topic + "-" + BATCH_ID + "-" + (i + 1);
    m.push({ key, value});
    i++;
  }
  return m;
}

const producerStart = async() => {
  await producer.connect();

  await producer.send({
    topic,
    messages: [{key: "start", value: "start"}],
  });

  setInterval( () => {
    const MESSAGES = populate(numPerSecond);
    producer.send({
      topic,
      messages: MESSAGES,
    });
  }, 1000);

};

producerStart();