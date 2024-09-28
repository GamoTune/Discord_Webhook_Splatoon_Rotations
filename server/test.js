const axios = require('axios');




axios.post('http://localhost:50000/splatoon/api/delete-webhooks', {
    pass: '12367/EAZv6k&2',
    url: "https://discord.com/api/webhooks/1289153109301530705/FgTEpIY-VySMKJwisRtN5lj_MpHoHKfaCjjpdkiMrfDgwq-LIBiZw1SYsT08AHZIU0F6",

})
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });