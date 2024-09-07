import express from "express";
import { createClient } from "redis";

const app = express();

app.use(express.json());

const PORT = 3000;
const client = createClient();
client.on('error', (err) => console.log('Redis Client Error- ', err));

app.post('/submit', async function(req,res){
    const problemId = req.body.problemId;
    const code = req.body.code;
    const langauge = req.body.langauge;

    try {
        await client.lPush("problems", JSON.stringify({code, langauge, problemId}));
        res.status(200).send("Submission received and stored!")
    } catch(err) {
        console.error("Redis Error: ", err);
        res.status(500).send("Failed to store submission");
    }
});

async function startServer() {
    try{
        await client.connect();
        console.log("Connected to Redis!");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch(err) {
        console.log("Failed to connect to the Redis - ", err);
    }
};

startServer();