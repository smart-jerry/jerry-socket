// webpush api:https://github.com/web-push-libs/web-push
// GCMAPI key: https://firebase.google.com/docs/cloud-messaging/?hl=zh-cn
const webpush = require('web-push');

function setup() {
  // 我们把GCM_API_KEY放到环境变量中，以下是源码：
  // if (process.env.GCM_API_KEY) {
  //    webPush.setGCMAPIKey(process.env.GCM_API_KEY);
  // }
  // webpush.setGCMAPIKey('<Your GCM API Key Here>');
  webpush.setVapidDetails(
    'mailto:smartjerrypeng@163.com',
    'BP9Hr1eshrZOxX4mSwN1ry7n3YMkCGHhd0kxQGwdgl3mTprKLo3k5m5Gpj7zOFELjL2-3CIegGOuPW-TSMEA64Q',
    '4YauauwmyH9U5t1o0XosXY4lq8DyZF6L-xY3FED5N6Q'
  );
  return Promise.resolve();
}

function sendMessageWithSubscription(data, subscription) {
  console.log(data, subscription,'=====')
  webpush.sendNotification(
    subscription,
    JSON.stringify(data),
    { proxy: 'http://127.0.0.1:4000' }
  ).then(response => {
    console.log('\nThe data send successfully:', JSON.stringify(data));
  }).catch(error => {
    console.log('\nThe data send failed:', error);
  });
}

module.exports = {
  setup,
  sendMessageWithSubscription
}
