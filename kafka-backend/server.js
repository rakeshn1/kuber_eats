const mongoose = require('mongoose');
const connection = new require('./kafka/Connection');
// topics files
const userAuth = require('./services/userAuth');
const userOrder = require('./services/userOrder');
// const imageUpload = require('./services/imageUpload');
const restaurantBasic = require('./services/restaurantBasic');
const restaurantDishnOrder = require('./services/restaurantDishnOrder');
const configurations = require('./config.json');

function handleTopicRequest(topic_name, fname) {
  // var topic_name = 'root_topic';
  const consumer = connection.getConsumer(topic_name);
  const producer = connection.getProducer();
  console.log('server is running ');
  consumer.on('message', (message) => {
    console.log(`message received for ${topic_name} `, fname);
    console.log(JSON.stringify(message.value));
    const data = JSON.parse(message.value);

    fname.handle_request(data.data, (err, res) => {
      console.log(`after handle${res}`);
      const payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res,
          }),
          partition: 0,
        },
      ];
      producer.send(payloads, (err, data) => {
        console.log(data);
      });
    });
  });
}

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 500,
};

(async () => {
  try {
    const res = await mongoose.connect(configurations.mongoDbConfiguration, options);
    if (res) {
      console.log('MongoDB Connected Successfully...');
      // Add your TOPICs here
      // first argument is topic name
      // second argument is a function that will handle this topic request
      handleTopicRequest('userAuth', userAuth);
      handleTopicRequest('userOrder', userOrder);
      handleTopicRequest('restaurantBasic', restaurantBasic);
      handleTopicRequest('restaurantDishnOrder', restaurantDishnOrder);
      // handleTopicRequest('restaurantAuth', Books);
      // handleTopicRequest('restaurantOrders', Dummy);
    }
  } catch (e) {
    console.error('MongoDB Connection Failed:');
    console.error(e);
    process.exit(0);
  }
})();
