const Redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.subscriber = Redis.createClient({
      url: "redis://default:PeIfKV05vcOefbfDHfExVA0V0aIvEtWp@redis-16712.c292.ap-southeast-1-1.ec2.redns.redis-cloud.com:16712",
    });
    this.publisher = Redis.createClient({
      url: "redis://default:PeIfKV05vcOefbfDHfExVA0V0aIvEtWp@redis-16712.c292.ap-southeast-1-1.ec2.redns.redis-cloud.com:16712",
    });
    this.subscriber.connect();
    this.publisher.connect();

    this.subscriber.on("error", (err) =>
      console.error("Subscriber error:", err)
    );
    this.publisher.on("error", (err) => console.error("Publisher error:", err));
  }

  async publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  subscribe(channel, listener) {
    if (typeof listener !== "function") {
      throw new TypeError("Listener must be a function");
    }

    this.subscriber.subscribe(channel, (message) => {
      listener(message, channel);
    });
  }
}

module.exports = new RedisPubSubService();
