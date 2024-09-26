const { get_webhooks_data, save_webhooks_data } = require('./get');


async function addWebhooks(data) {
    /*
    data = {
        server_id: "123456789",
        channel_id: "123456789",
        type: "test",
        url: "https://discord.com/api/webhooks/123456789/123456789",
    }
    */
    let server_id = data.server_id;
    let channel_id = data.channel_id;
    let type = data.type;
    let url = data.url;

    let webhook_data = await get_webhooks_data();

    if (!webhook_data[server_id]){
        webhook_data[server_id] = {};
    }
    if (!webhook_data[server_id][channel_id]){
        webhook_data[server_id][channel_id] = {};
    }

    webhook_data[server_id][channel_id] = {
        type: type,
        webhook: url
    }

    await save_webhooks_data(webhook_data);
    return {message: 'Data(s) saved', code: 200};
}

async function deleteWebhooks(data) {
    /*
    data = {
        server_id: "123456789",
        channel_id: "123456789",
        url: "https://discord.com/api/webhooks/123456789/123456789",
    }
    */
    let webhook_data = await get_webhooks_data();
    
    let server_id = data.server_id;
    let channel_id = data.channel_id;
    let url = data.url;

    if (!server_id || !channel_id){
        for (server in webhook_data){
            for (channel in webhook_data[server]){
                if (webhook_data[server][channel].webhook == url){
                    server_id = server;
                    channel_id = channel;
                }
                else {
                    return {message: 'Webhook not found', code: 404};
                }
            }
        }
    }


    if (!webhook_data[server_id]){
        return {message: 'Server not found', code: 404};
    }
    if (!webhook_data[server_id][channel_id]){
        return {message: 'Channel not found', code: 404};
    }

    delete webhook_data[server_id][channel_id];

    if (Object.keys(webhook_data[server_id]).length == 0){
        delete webhook_data[server_id];
    }

    await save_webhooks_data(webhook_data);
    return {message: 'Data(s) deleted', code: 200};
}



module.exports = {
    addWebhooks,
    deleteWebhooks

}