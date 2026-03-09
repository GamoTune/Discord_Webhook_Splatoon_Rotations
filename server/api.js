const express = require('express');
const { delete_webhooks } = require('../manage_db/delete');
const { get_webhooks_by_params, get_id_by_params, get_table_by_id } = require('../manage_db/get');
const { post_webhooks } = require('../manage_db/post');

const app = express();
app.use(express.json());
const port = 50000;


app.post('/splatoon/api/add-webhooks', (req, res) => {
    /*
    data = {
        "pass": "password",
        "url": "https://discord.com/api/webhooks/...",
        "type": "normal",
        "channel": "123456789",
        "server": "123456789",
    }
    */
    data = req.body;
    if (data.pass !== '12367/EAZv6k&2') {
        res.json({message: 'Wrong password', code: 401});
       return;
    }

    let sql_request = `INSERT INTO webhook (url, type, channel, server) VALUES ('${data.url}', '${data.type}', '${data.channel}', '${data.server}')`;
    post_webhooks(sql_request)
        .then(response => {
            res.send(response);
        });

});

app.post('/splatoon/api/delete-webhooks', (req, res) => {
    /*
    data = {
        pass: "password",
        id: "1"
    */
    data = req.body;
    if (data.pass !== '12367/EAZv6k&2') {
        res.json({message: 'Wrong password', code: 401});
        return;
    }

    delete_webhooks(data.id)
        .then(response => {
            res.send(response);
        });

});

app.post('/splatoon/api/get-webhooks', (req, res) => {
    /*
    data = {
        pass: "password",
        type: "normal",
        channel: "123456789",
        server: "123456789"
    }
    */
    data = req.body;
    if (data.pass !== '12367/EAZv6k&2') {
        res.json({message: 'Wrong password', code: 401});
        return;
    }

    delete data.pass;

    if (data == {}) {
        res.json({message: 'No parameters', code: 400});
        return;
    }

    get_webhooks_by_params(data)
        .then(response => {
            res.send(response);
        });
});

app.post('/splatoon/api/get-webhooks-id', (req, res) => {
    /*
    data = {
        pass: "password",
        type: "normal",
        channel: "123456789",
        server: "123456789"
    }
    */
    data = req.body;
    if (data.pass !== '12367/EAZv6k&2') {
        res.json({message: 'Wrong password', code: 401});
        return;
    }

    delete data.pass;

    if (data == {}) {
        res.json({message: 'No parameters', code: 400});
        return;
    }

    get_id_by_params(data)
        .then(response => {
            res.send(response);
        });
});

app.post('/splatoon/api/get-tables', (req, res) => {
    /*
    data = {
        pass: "password",
        id: "01"
    }
    */
    data = req.body;
    if (data.pass !== '12367/EAZv6k&2') {
        res.json({message: 'Wrong password', code: 401});
        return;
    }

    get_table_by_id(data.id)
        .then(response => {
            res.send(response);
        });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});