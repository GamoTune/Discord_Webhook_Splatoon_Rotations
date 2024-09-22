const fs = require('fs');
const { json_to_js } = require('../convert_json');

module.exports = {
    get_rotations,
    get_normal_schedules,
    get_anarchy_schedules,
    get_x_schedules,
    get_event_schedules,
    get_fest_schedules,
    get_coop_schedules,
    get_images,
    get_paths_images,
    get_path_by_name,
    get_now_image_by_name,
    get_webhooks_url,
    get_test_webhooks_url,
}

const name_undefined = {
    'regular': 'classique_undefined',
    'Ouvert': 'classique_undefined',
    'Série': 'classique_undefined',
    'x': 'classique_undefined',
    'event': 'challenge_undefined',
    'coop': 'salmon_undefined',
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



// GET des images ---------------------------------------------------------------------------------------------------


async function get_paths_images() {
    const paths = [];
    const path = 'splatoon/img_rotations/';
    const folders = fs.readdirSync(path);
    folders.forEach(folder => {
        const files = fs.readdirSync(path + folder);
        files.forEach(file => {
            paths.push(path + folder + '/' + file);
        });
    });
    return paths;
}

async function get_images() {
    const images = [];
    const paths = await get_paths_images();
    paths.forEach(path => {
        images.push(fs.readFileSync(path));
    });
    return images;
}

async function get_path_by_name(name){
    const paths = await get_paths_images();
    const path = paths.find(path => path.includes(name));

    if (!path) {
        name = name_undefined[name];
        return paths.find(path => path.includes(name));
    }
    return path;
}

async function get_now_image_by_name(name){
    const path = await get_path_by_name(name);
    const last = json_to_js('splatoon/data_img.json');

    const new_path = last.find(value => path.includes(value));

    if (!new_path) {
        const paths = await get_paths_images();
        name = name_undefined[name];
        return paths.find(path => path.includes(name)); 
    }
    return new_path;

}

// GET des webhooks ---------------------------------------------------------------------------------------------------

async function get_webhooks_url() {
    let urls = await json_to_js(LOCAL_URL + 'webhooks.json');
    return urls;
}

async function get_test_webhooks_url() {
    let urls = await json_to_js(LOCAL_URL + 'webhooks_test.json');
    return urls;
}