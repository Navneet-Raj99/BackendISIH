const express = require('express');
const http = require('http');
const mqtt = require('mqtt');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
require('dotenv').config();


const{mqttUsername1,mqttPassword1,mqttBroker1 }= process.env

console.log(mqttBroker1)

const mqttBroker = mqttBroker1;

// MQTT credentials
const mqttUsername = mqttUsername1;
const mqttPassword = mqttPassword1;

// Subscribe to the desired MQTT topic
const mqttTopic = 'dashboard/vehicle'; // Replace with your desired MQTT topic
const mqttClient = mqtt.connect(mqttBroker, { username: mqttUsername, password: mqttPassword });
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');

    // Subscribe to the MQTT topic
    mqttClient.subscribe(mqttTopic);
});

// Listen for incoming MQTT messages
mqttClient.on('message', (topic, message) => {
    if (topic === mqttTopic) {
        const data = message.toString();
        console.log('Received MQTT message:', data);

        // Emit the MQTT message to connected sockets (React Native app)
        io.emit('mqtt_message', data);
    }
});

// Handle errors
mqttClient.on('error', (error) => {
    console.error('MQTT error:', error);
});

// Handle MQTT broker disconnection
mqttClient.on('close', () => {
    console.log('Disconnected from MQTT broker');
});

// Serve the HTML page
app.get('/', (req, res) => {
    res.send("Hello")
    // res.sendFile(__dirname + '/index.html'); // Replace with your HTML file
});

// Define an API endpoint to receive data
app.post('/api/receiveData', (req, res) => {
    // Process the incoming data
    console.log('Received data via API:', req.body);
    res.json({ success: true });
});

// WebSocket connection
io.on('connection', (socket) => {
    console.log('Client connected', socket?.id);

    // Handle client disconnection
    // console.log(socket)
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle server termination
process.on('SIGINT', () => {
    mqttClient.end();
    process.exit();
});
