const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { json_to_js, js_to_json } = require('../convert_json');

const data = {
    "pass": "12367/EAZv6k&2",
    "normal": "https://discord.com/api/webhooks/1260945003472097380/HBAM4bSE20c06jgIjGRkFqLPUP-cmfAnt5Bv5ajoS7ypBB5I30YmPheAS8IxrRQgLoYq",
    "event": "https://discord.com/api/webhooks/1267103177334063166/zcV_OMzkuFzTLmQKH129AlMg9B8qcc5pRaxeTTZvoGH2mVggBddJqHiUyoZKjy5zGH36",
    "coop": "https://discord.com/api/webhooks/1267103277624066049/q6Pb_9BNYmjlUrFG06T8c0Vm2PPZYYXKZ9tS4t3REuXTeqCEjZ5aae34spQrvnhT_6N1"
};

axios.post('http://localhost:50000/api/splatoon/add-webhooks', data)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });