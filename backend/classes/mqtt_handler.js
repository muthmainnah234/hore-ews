const mqtt = require('mqtt');
const Alarm = require('../models/Alarm');

class MqttHandler {
  constructor() {
    this.mqttClient = null;
		this.host = 'mqtt://broker.hivemq.com';
  }
  
  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host);

		// Mqtt error calback
		this.mqttClient.on('error', (err) => {
			console.log(err);
			this.mqttClient.end();
		});

		// Connection callback
		this.mqttClient.on('connect', () => {
			console.log(`mqtt client connected`);
		});

		// mqtt subscriptions
		this.mqttClient.subscribe('hore-ews/state/#');

		// When a message arrives, console.log it
		this.mqttClient.on('message', (topic, data) => {
			console.log('message received in topic : ', topic);
			
			// when message arrives on hore-ews/state/:id, update alarm with the id by data sent
			if (topic.substring(0,15) === 'hore-ews/state/') {
        const subtopics = topic.split('/');
				const state = parseInt(data);

				let update = {};
				if (state >= 0 && state <= 2) {
					update.connection = 'ON';
					update.alarmState = state;
				}

				Alarm.update({ idEsp: subtopics[2] }, { $set: update }, (updateErr, newAlarm) => {
					if (updateErr) {
						console.log(updateErr.message || 'Error at updating alarm');
					} else if (newAlarm) {
						console.log('Alarm ', subtopics[2], ': Updating success!');
					}
				})
			} else {
				console.log(data);
			}
		});

		this.mqttClient.on('close', () => {
			console.log(`mqtt client disconnected`);
		});
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(topic, data) {
		console.log('sending to ' + topic);
		this.mqttClient.publish(topic, data);
  }
}

module.exports = MqttHandler;