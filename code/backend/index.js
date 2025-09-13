const express = require('express')
const bodyParser = require('body-parser')
const mqtt = require('mqtt')
var cors = require('cors')

const app = express()
const port = 8700;

const addr = "mqtt://192.168.246.172"
const channel1 = "test_channel1";
const channel2 = "test_channel2";

app.use(bodyParser.json())
app.use(cors())

options = {
    connectTimeout: 5000,
    port: 1883,
    keepalive: 5,
}

app.get('/takePhoto', (req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    console.log("connect to server")
    const client = mqtt.connect(addr, options)
    client.subscribe(channel2, async(err) => {
        if(err){
            console.log(err);
            return res.status(500).send("error subscribing")
        }else{
            const mes = "takePic"
            client.publish(channel1, mes, ()=> {
                console.log(`message sent: ${mes}`)
            })
        }
    })

    client.on('message', async (topic, received) => {
        //console.log("topic: ", topic)
        console.log("Received: ", received.toString())
        if(topic === channel2){
            client.unsubscribe(topic)
            client.end()
            return res.status(200).send(received.toString())
        }
    })
})

app.get('/finish', (req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    console.log("connect to server")
    const client = mqtt.connect(addr, options)
    client.subscribe(channel2, async(err) => {
        if(err){
            console.log(err);
            return res.status(500).send("error subscribing")
        }else{
            const mes = "finishTake"
            client.publish(channel1, mes, ()=> {
                console.log(`message sent: ${mes}`)
            })
        }
    })

    client.on('message', async (topic, received) => {
        //console.log("topic: ", topic)
        console.log("Received: ", received.toString())
        if(topic === channel2){
            client.unsubscribe(topic)
            client.end()
            return res.status(200).send(received.toString())
        }
    })
})

app.get('/takeStuff/:NUM', (req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    console.log("connect to server")
    console.log(req.params)
    const mess = "takeObj_" + req.params.NUM.toString()
    console.log(mess);
    const client = mqtt.connect(addr, options)
    client.subscribe(channel2, async(err) => {
        if(err){
            console.log(err);
            return res.status(500).send("error subscribing")
        }else{
            const mes = "takeObj_" + req.params.NUM.toString()
            client.publish(channel1, mes, ()=> {
                console.log(`message sent: ${mes}`)
            })
        }
    })

    client.on('message', async (topic, received) => {
        //console.log("topic: ", topic)
        console.log("Received: ", received.toString())
        if(topic === channel2){
            client.unsubscribe(topic)
            client.end()
            return res.status(200).send(received.toString())
        }
    })
})

app.get('/schedule/:NUM', (req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    console.log("connect to server")
    console.log(req.params.NUM)
    const client = mqtt.connect(addr, options)
    client.subscribe(channel2, async(err) => {
        if(err){
            console.log(err);
            return res.status(500).send("error subscribing")
        }else{
            const mes = "schedule_" + req.params.NUM
            client.publish(channel1, mes, ()=> {
                console.log(`message sent: ${mes}`)
            })
        }
    })

    client.on('message', async (topic, received) => {
        //console.log("topic: ", topic)
        console.log("Received: ", received.toString())
        if(topic === channel2){
            client.unsubscribe(topic)
            client.end()
            return res.status(200).send(received.toString())
        }
    })
})

app.get('/putStuff/:NUM', (req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    console.log(req.params)
    const client = mqtt.connect(addr, options)
    client.subscribe(channel2, async(err) => {
        if(err){
            console.log(err);
            return res.status(500).send("error subscribing")
        }else{
            const mes = "putObj_" + req.params.NUM.toString()
            client.publish(channel1, mes, ()=> {
                console.log(`message sent: ${mes}`)
            })
        }
    })

    client.on('message', async (topic, received) => {
        //console.log("topic: ", topic)
        console.log("Received: ", received.toString())
        if(topic === channel2){
            client.unsubscribe(topic)
            client.end()
            return res.status(200).send(received.toString())
        }
    })
})

const server = app.listen(port, () => {
    console.log("server listen")
})

server.requestTimeout = 1000;