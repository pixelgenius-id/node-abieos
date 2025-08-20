const {Abieos} = require('@pixelgeniusid/node-abieos');
const {readFileSync} = require('node:fs');
const {typeTests} = require('./tests.cjs');

const ABIs = [
    {code: 'vexcore', path: './ABIs/eosio.json'},
    {code: 'vex.msig', path: './ABIs/eosio.msig.json'},
    {code: 'vex.token', path: './ABIs/eosio.token.raw'}
];

const abieos = Abieos.getInstance();

console.log(abieos);

ABIs.forEach(value => {
    const data = readFileSync(value.path).toString();
    console.log(`Loading ${value.code} ABI...`);
    if (value.path.endsWith('raw')) {
        const buffer = Buffer.from(data, 'base64');
        const abiLoadStatus = abieos.loadAbiHex(value.code, buffer.toString('hex'));
        console.log(`${value.code} ABI as HEX Loaded: ${abiLoadStatus}`);
    } else {
        const abiLoadStatus = abieos.loadAbi(value.code, data);
        console.log(`${value.code} ABI as JSON Loaded: ${abiLoadStatus}`);
    }
});

typeTests(abieos);

// stringToName
console.log('stringToName: vexcore -->', abieos.stringToName('vexcore'));

const serializationTests = [
    {
        account: 'vexcore',
        name: 'voteproducer',
        data: {
            voter: "voteracct111",
            proxy: "",
            producers: ["prod1", "prod2", "prod3"]
        },
        expects: '1042C80899AB32DD000000000000000003000000008090E8AD000000000091E8AD000000008091E8AD'
    }
];

const runSerializationTests = () => {
    let sum = 0;
    serializationTests.forEach((value, index) => {
        // seriallize action data
        const tref = process.hrtime.bigint();
        let actionHexData;
        let actionJsonData;
        const type = abieos.getTypeForAction(value.account, value.name);
        try {
            actionHexData = abieos.jsonToHex(value.account, type, value.data);
            // console.log(actionHexData);
            if (actionHexData !== value.expects) {
                console.log(`ERROR - Got: ${actionHexData}, Expected: ${value.expects}`);
            }
            actionJsonData = abieos.hexToJson(value.account, type, actionHexData);
            // console.log(actionJsonData);
        } catch (e) {
            console.log(e);
        }
        sum += Number(process.hrtime.bigint() - tref) / 1e3;
    });
    return sum / serializationTests.length;
};

let sum = 0;
let totalRuns = 50;
for (let i = 0; i < totalRuns; i++) {
    sum += runSerializationTests();
}

console.log(`Average execution (getTypeForAction + jsonToHex + hexToJson): ${sum / totalRuns} us on ${totalRuns} runs`);

// delete contract from cache, returns true or false
const status = abieos.deleteContract("vexcore");
if (status) {
    console.log('OK - contract deleted');
} else {
    console.log('ERROR - contract not found');
}

// check whether the contract was deleted
try {
    abieos.getTypeForAction("vexcore", "voteproducer");
} catch (e) {
    console.log('OK - Contract context removal confirmed');
}
