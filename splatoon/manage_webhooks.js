const { get_webhooks_url } = require('./get');
const { js_to_json } = require('../convert_json');

async function find_webhooks(url) {
    const webhook = await get_test_webhooks_url();
    
    //Pour chaque type de webhook
    for (let type in webhook) {
        //Pour chaque webhook
        for (let i = 0; i < webhook[type].length; i++) {
            if (webhook[type][i] === url) {
                return { type: type, index: i };
            }
        }
    }
    return null;
}

async function addWebhooks(data) {
    const webhooks = await get_webhooks_url();
    if (data.normal === '' || data.event === '' || data.coop === '') {
        return {data: 'Webhook(s) can\'t be empty', code: 400};
    }
    if (webhooks.normal.includes(data.normal) || webhooks.event.includes(data.event) || webhooks.coop.includes(data.coop)) {
        return {data: 'Webhook(s) already exists', code: 400};
    }
    webhooks.normal.push(data.normal);
    webhooks.event.push(data.event);
    webhooks.coop.push(data.coop);
    js_to_json('splatoon/webhooks.json', webhooks);
    return {data: 'Webhook(s) created', code: 201};;
}






module.exports = {
    addWebhooks,
    find_webhooks

}