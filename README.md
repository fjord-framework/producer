<p align="center">
  <img src="./readme_materials/fjord.svg" width="500" height="200" />
</p>

# Test Producer

This repository contains three `.js` scripts that can be used to test the production of records into a Kafka cluster.

1. `producer.js` is the simplest script. Run it to test the production of one record into a cluster. Sample usage: `node producer.js stocks ko 125`. The arguments passed represent the Kafka topic, the record key, and the record value.

2. `batch.js` produces a one-time batch of records into a cluster. Sample usage: `node batch.js stocks 1000`. Here, the arguments represent the topic and the number of records. The key will be a random number between 1 and 10, and the value will be a combination of the topic, time in milliseconds, and record number as it's created in the program.

3. `interval.js` produces a specified number of records per second into the cluster. Sample usage: `node interval.js stocks 10`. The arguments here represent the Kafka topic and the number of records you want to producer per second.

Be sure to include a `.env` file with the following environmental variables:

```
CLIENT=
BROKERS=
KAFKA_USERNAME=
KAFKA_PASSWORD=
SECURITY=
```
