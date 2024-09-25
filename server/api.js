const express = require('express');
const { addWebhooks, deleteWebhooks } = require('../splatoon/manage_webhooks');

const app = express();
app.use(express.json());
const port = 50100;


app.post('/api/splatoon/add-webhooks', (req, res) => {
    /*
    data = {
        "pass": "password",
        "normal": "",
        "event": "",
        "coop": ""
    }
    */
    data = req.body;
    if (data.pass !== '12367/EAZv6k&2') {
        res.json({message: 'Wrong password', code: 401});
       return;
    }
    addWebhooks(data)
        .then(response => {
            console.log(response);
            res.send(response);
        });
});

app.post('/api/splatoon/delete-webhooks', (req, res) => {
    /*
    data = {
        "pass": "password,
        "server_id": "000000000",
        "channel_id": "000000001",
    */
    data = req.body;
    if (data.pass !== '12367/EAZv6k&2') {
        res.json({message: 'Wrong password', code: 401});
        return;
    }
    deleteWebhooks(data)
        .then(response => {
            console.log(response);
            res.send(response);
        });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});