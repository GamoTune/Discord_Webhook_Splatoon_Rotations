const axios = require('axios');


axios.post('http://localhost:50100/api/splatoon/add-webhooks', {
    pass: '12367/EAZv6k&2',
    server_id: "000000000",
    channel_id: "000000001",
    type: "test4",
    url: "https://kaozknnfnzef.com/789/123456789",

})
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });