const express = require('express');
const { json_to_js, js_to_json } = require('../convert_json');
const { addWebhooks } = require('../splatoon/manage_webhooks');

const app = express();
app.use(express.json());
const port = 50000;



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
        res.json({error: 'Wrong password', code: 401});
       return;
    }
    addWebhooks(data)
        .then(response => {
            console.log(response);
            res.send(response);
        });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});




