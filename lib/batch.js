const { Kafka } = require('kafkajs');
require('dotenv').config();

const { BROKERS, CLIENT, SECURITY, KAFKA_USERNAME, KAFKA_PASSWORD } = process.env;
const myArgs = process.argv.slice(2);
let [topic, num, type, batch] = myArgs;  // node batch.js stocks 1000
let complex = (type === "complex");      // node batch.js stocks 1000 complex
                                         // node batch.js stocks 1000 not batch_name

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

const BATCH_ID = batch ? batch : Date.now();

const MESSAGES = populate(num);

function populate(num) {
  const m = [];
  let i = 0;
  let key, value;
  while (i < num) {
    key = String(1 + Math.floor(Math.random()*10));
    value = complex ? objectify(i) : topic + "-" + BATCH_ID + "-" + (i + 1);
    m.push({ key, value});
    i++;
  }
  return m;
}

function objectify(i) {
  return JSON.stringify({
    topic,
    batch_id: BATCH_ID,
    record_id: i+1,
    last: (i + 1 === num)
  });
}

const producerStart = async() => {
  await producer.connect();

  await producer.send({
    topic,
    messages: [{key: "start", value: "start"}],
  });

  await producer.send({
    topic,
    messages: MESSAGES,
  });

  await producer.send({
    topic,
    messages: [{key: "end", value: "end"}],
  });

  await producer.disconnect();
};

producerStart();