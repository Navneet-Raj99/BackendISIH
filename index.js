const express = require('express');
const http = require('http');
const mqtt = require('mqtt');
const socketIO = require('socket.io');
const connectToMongo = require('./db')
const mongoose = require('mongoose');
const authenticateUser = require('./middleware/middle');
connectToMongo();

var cors = require('cors')



// const { Fernet } = require('cryptography');
const crypto = require('crypto');


const app = express();
app.use(cors())
const server = http.createServer(app);
const io = socketIO(server);
require('dotenv').config();
app.use(express.json());

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { mqttUsername1, mqttPassword1, mqttBroker1, secretKey, encrptionPassword } = process.env

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


// Handle errors
mqttClient.on('error', (error) => {
    console.error('MQTT error:', error);
});


io.on('connection', (socket) => {
    console.log('Client connected', socket?.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

mqttClient.on('message', (topic, message) => {
    // console.log("hello");
    if (topic === mqttTopic) {
        const data = message.toString();
        // console.log('Received MQTT message1:', data);
        io.emit('mqtt_message', data);
        // console.log("jjjj")
    }
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






let client

app.post('/login', (req, res) => {

    try {
        const { username, password } = req.body;
        console.log(username, password)
        const client = mqtt.connect(mqttBroker1, {

            username: username,
            password: password
        });
        client.on('connect', async function () {
            try {
                console.log('Connected to MQTT broker')

                const token = jwt.sign({ username: username }, secretKey, { expiresIn: '1h' });
                client.subscribe(mqttTopic);
                io.on('connection', (socket) => {
                    console.log('Client connected', socket?.id);
                    socket.on('disconnect', () => {
                        console.log('Client disconnected');
                    });
                });
                res.json({
                    "Connection": true,
                    "AUTH_TOKEN": token
                })


            } catch (error) {
                console.log(error)
            }

        });
        client.on('error', (error) => {
            try {
                // console.error('MQTT connection error:', error);
                return res.status(401).json({
                    "Connection": false,
                    "message": "Unauthorized Access - MQTT connection failed"
                });
                return;

            } catch (error) {

            }

        });


    } catch (error) {
        // console.log(error);

    }


});

app.post('/specifiedData', authenticateUser, async (req, res) => {
    const { userId } = req.body;
    const dataCollection = mongoose.connection.db.collection('hiveMQCollection');



    const findAllData = async (userId) => {
        try {
            // Find all documents in the collection
            const allData = await dataCollection.find({ user_id: userId }).sort({ _id: -1 }).toArray();

            // Print or process the retrieved data
            console.log("All data:", allData[0]?._id);


            let finalData = decryptdATA(allData[0]?.data, encrptionPassword);
            res.json({ "data": finalData })
        } catch (error) {
            console.error("Error finding data:", error.message);
        } finally {
            // Close the MongoDB connection
            // mongoose.connection.close();
        }
    };

    const decryptdATA = (singleData, key) => {
        console.log("entered")

        const decryptionKey = Buffer.from(key, 'hex');  // Use the same key generated in Python
        const decipher = crypto.createDecipheriv('aes-128-ecb', decryptionKey, Buffer.alloc(0));

        let decryptedData = decipher.update(Buffer.from(singleData, 'base64'), 'binary', 'utf8');
        decryptedData += decipher.final('utf8');

        console.log(decryptedData);
        // // Unpad the decrypted data
        // const lastCharCode = decryptedData.charCodeAt(decryptedData.length - 1);
        // decryptedData = decryptedData.slice(0, -lastCharCode);


        return decryptedData;
    }


    findAllData(userId);


})

// Define an API endpoint to receive data
app.post('/api/receiveData', (req, res) => {
    // Process the incoming data
    console.log('Received data via API:', req.body);
    res.json({ success: true });
});

// WebSocket connection


// Start the server
const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle server termination
process.on('SIGINT', () => {
    mqttClient.end();
    process.exit();
});
