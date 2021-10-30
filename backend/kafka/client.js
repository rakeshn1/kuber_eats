// eslint-disable-next-line global-require
const rpc = new (require('./kafkarpc'))();

// make request to kafka
// eslint-disable-next-line camelcase
function make_request(queue_name, msg_payload, callback) {
  console.log('in make request');
  console.log(msg_payload);
  rpc.makeRequest(queue_name, msg_payload, (error, response) => {
    if (error) {
      callback(error, null);
    } else {
      console.log('response', response);
      callback(null, response);
    }
  });
}

// eslint-disable-next-line camelcase
exports.make_request = make_request;
