const axios = require('axios');

async function test() {
    await axios.get('http://localhost:50000/', {
        params: {
            ID: 12345
        } 
    })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error.response.status);
        });
}

test();