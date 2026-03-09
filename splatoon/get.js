const { json_to_js } = require('../convert_json');

module.exports = {
    get_rotations,
}

const LOCAL_URL = 'splatoon/';

// GET des rotations ---------------------------------------------------------------------------------------------------

async function get_rotations() {
    const info = json_to_js('splatoon/rotations_data.json');
    return info.data;
}