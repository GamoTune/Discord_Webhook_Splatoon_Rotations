const fs = require('fs');
const { json_to_js, js_to_json } = require('../convert_json');

module.exports = {
    get_rotations,
    get_normal_schedules,
    get_anarchy_schedules,
    get_x_schedules,
    get_event_schedules,
    get_fest_schedules,
    get_coop_schedules,
    get_webhooks_data,
    save_webhooks_data,
    get_test_webhooks_data,
    save_test_webhooks_data,
}

const LOCAL_URL = 'splatoon/';

// GET des rotations ---------------------------------------------------------------------------------------------------

async function get_rotations() {
    const info = json_to_js('splatoon/rotations_data.json');
    return info.data;
}

async function get_normal_schedules() {
    const data = await get_rotations();
    return data.regularSchedules.nodes;
}

async function get_anarchy_schedules() {
    const data = await get_rotations();
    return data.bankaraSchedules.nodes;
}

async function get_x_schedules() {
    const data = await get_rotations();
    return data.xSchedules.nodes;
}

async function get_event_schedules() {
    const data = await get_rotations();
    return data.eventSchedules.nodes;
}

async function get_fest_schedules() {
    const data = await get_rotations();
    return data.festSchedules.nodes;
}

async function get_coop_schedules() {
    const data = await get_rotations();
    return data.coopGroupingSchedule;
}


// GET des webhooks ---------------------------------------------------------------------------------------------------

async function get_webhooks_data() {
    let urls = await json_to_js(LOCAL_URL + "webhooks.json");
    return urls;
}

async function get_test_webhooks_data() {
    let data = await json_to_js(LOCAL_URL + "webhook_test.json");
    return data;
}

async function save_webhooks_data(data) {
    js_to_json(LOCAL_URL + "webhooks.json", data);
}

async function save_test_webhooks_data(data) {
    js_to_json(LOCAL_URL + "webhooks.json", data);
}