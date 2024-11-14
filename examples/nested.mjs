import {Abieos} from "@eosrio/node-abieos";
import {ABI, Action, Serializer} from "@wharfkit/antelope";
import {readFileSync} from "node:fs";
import {typeTests} from "./tests.mjs";

const abieos = Abieos.getInstance();

// load abieos from head block for eoshashpoker
const data = await fetch('https://api.eosrio.io/v1/chain/get_abi', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({account_name: 'eoshashpoker'}),
});
const json = await data.json();

// let original = JSON.stringify(json.abi);
// original = original.replaceAll('vec_string[]', 'string[]');

const sampleActionData = {
    "player": "333notice333",
    "game_id": "321747",
    "action_at": "1731455641500",
    "blocknum": 404422147,
    "bet_amount": "100.0000 EOS",
    "hand_bets": [
        "100.0000 EOS"
    ],
    "payout_amounts": [
        "200.0000 EOS"
    ],
    "player_hands": [
        "2801"
    ],
    "dealer_hand": "282728",
    "player_hands_string": [
        [
            "Heart 8|e179f60850ed0f0a424dd195a8d71fb8658f76cfcc166a9d970bdd4d0e70b2e8,181afdee6b05723305c4081461a4e33eb3a1c4180f25f139d9d07fa81cc8bb98,EOS6M1ApKtBX4FigaWsCCSP7QNjXKqgChNULnLadqW6Yz8ysQEDFq,SIG_K1_KX5Va4pN6kzDq2FnYQNLwzjeAY3ekT2Jxok9diNqYB2LuenF2hYW263hvVcsH56FNeMkA8jPtU74XZvDzcXjCooAAanjE2",
            "Club A|812676a2840732275856977c646c04cf5fbd7506c83d6d3b0f327f42d2769a01,181afdf08b87efbf3bafb07dafe66c8d496bea46192d0beef02af09eae3ccc8f,EOS6M1ApKtBX4FigaWsCCSP7QNjXKqgChNULnLadqW6Yz8ysQEDFq,SIG_K1_KXkxSELcuBphUVNwS4VREb9Z7drZzCZTvJFteB1PrbNmyg5EqtXEMbyM9tdJcgiQXQxQ3eRZutpBGdSJ3mJyQ3GG9xsRVZ"
        ],
        [
            "Heart 8|e179f60850ed0f0a424dd195a8d71fb8658f76cfcc166a9d970bdd4d0e70b2e8,181afdee6b05723305c4081461a4e33eb3a1c4180f25f139d9d07fa81cc8bb98,EOS6M1ApKtBX4FigaWsCCSP7QNjXKqgChNULnLadqW6Yz8ysQEDFq,SIG_K1_KX5Va4pN6kzDq2FnYQNLwzjeAY3ekT2Jxok9diNqYB2LuenF2hYW263hvVcsH56FNeMkA8jPtU74XZvDzcXjCooAAanjE2",
            "Club A|812676a2840732275856977c646c04cf5fbd7506c83d6d3b0f327f42d2769a01,181afdf08b87efbf3bafb07dafe66c8d496bea46192d0beef02af09eae3ccc8f,EOS6M1ApKtBX4FigaWsCCSP7QNjXKqgChNULnLadqW6Yz8ysQEDFq,SIG_K1_KXkxSELcuBphUVNwS4VREb9Z7drZzCZTvJFteB1PrbNmyg5EqtXEMbyM9tdJcgiQXQxQ3eRZutpBGdSJ3mJyQ3GG9xsRVZ"
        ],
        [
            "Heart 8|e179f60850ed0f0a424dd195a8d71fb8658f76cfcc166a9d970bdd4d0e70b2e8,181afdee6b05723305c4081461a4e33eb3a1c4180f25f139d9d07fa81cc8bb98,EOS6M1ApKtBX4FigaWsCCSP7QNjXKqgChNULnLadqW6Yz8ysQEDFq,SIG_K1_KX5Va4pN6kzDq2FnYQNLwzjeAY3ekT2Jxok9diNqYB2LuenF2hYW263hvVcsH56FNeMkA8jPtU74XZvDzcXjCooAAanjE2",
            "Club A|812676a2840732275856977c646c04cf5fbd7506c83d6d3b0f327f42d2769a01,181afdf08b87efbf3bafb07dafe66c8d496bea46192d0beef02af09eae3ccc8f,EOS6M1ApKtBX4FigaWsCCSP7QNjXKqgChNULnLadqW6Yz8ysQEDFq,SIG_K1_KXkxSELcuBphUVNwS4VREb9Z7drZzCZTvJFteB1PrbNmyg5EqtXEMbyM9tdJcgiQXQxQ3eRZutpBGdSJ3mJyQ3GG9xsRVZ"
        ]
    ],
    "dealer_hand_string": [
        "Heart 8|626daf10e30603ecd3fb79ffc475e420df5d55dfe869565a2b0ce443a550ea28,181afdef1b4cde5ab891dfa22468b77b71a0b245b64f1cddb5f994adc7cefa82,EOS6M1ApKtBX4FigaWsCCSP7QNjXKqgChNULnLadqW6Yz8ysQEDFq,SIG_K1_KcmeS6FAWHfJDW55oYhxFPX2otj6NYHcyexghMahKqE4mmPtVsPZjtDwB6fZwA1x7Kehae3TPxS9VtPvhzQ1Vc6maGCmfR",
        "Heart 7|76a38f62b69dd77e7667cdfd43626cef3bc9fd631075262df87992559686d327,181afe04f128b3c9b2af64c76ef4669fdb0f2cb0a0fe3fa876e507d1ce1332cc,EOS6M1ApKtBX4FigaWsCCSP7QNjXKqgChNULnLadqW6Yz8ysQEDFq,SIG_K1_KdifEMW68hELMxN15oJfein5WrA64FvaobYPYzndSHkmFbft7EcvRFm2GW4RZnb2LNMK2HnUYxfNhMZbRgpL7awVKVfDh8",
        "Heart 8|de1ed9eb439b73d7005a4b98050b10a0cea521a8cc92979efe58c748c127ef28,181afe050860a88c66ae13005ca0630dba3d16fffab3ad7d7ff5674c0bc37e6b,EOS6M1ApKtBX4FigaWsCCSP7QNjXKqgChNULnLadqW6Yz8ysQEDFq,SIG_K1_Jwimc5dVkKJ15KLbTWtBa5ZajWFkTciFaunbTbGcpC18ZDbeV9BDo4gKpgt7g39T1y8MEz3YVZwdMTau4Vsdx8pThQUk8Z"
    ],
    "results": [
        "Player Wins"
    ],
    "player_rate": "19",
    "referrer": "eosbetadmin1",
    "referrer_rate": "78",
    "vip_level": "20"
};

const abi = ABI.from(json.abi);

const action = new Action({
    account: 'eoshashpoker',
    name: 'endgame',
    data: sampleActionData,
});

const serializedData = Serializer.encode({
    abi,
    type: 'endgame',
    object: sampleActionData
})

const hexData = serializedData.toString('hex');

console.log(hexData);

const deserializedData = Serializer.decode({
    abi,
    type: 'endgame',
    data: serializedData
});

console.log(deserializedData);

abieos.loadAbi('eoshashpoker', abi.toJSON());

const abieosDecoded = abieos.hexToJson('eoshashpoker', 'endgame', hexData);

console.log(abieosDecoded);

// const abi = JSON.parse(original);
// abi.structs = [];
//
// for (const struct of json.abi.structs) {
//     abi.structs = [struct];
//     const loaded = abieos.loadAbi('eoshashpoker', abi);
//     if (!loaded) {
//         console.log('ERROR - Failed to load ABI - Struct:', struct.name);
//     }
// }


// ABIs.forEach(value => {
//     const data = readFileSync(value.path).toString();
//     console.log(`Loading ${value.code} ABI...`);
//     if (value.path.endsWith('raw')) {
//         const buffer = Buffer.from(data, 'base64');
//         const abiLoadStatus = abieos.loadAbiHex(value.code, buffer.toString('hex'));
//         console.log(`${value.code} ABI as HEX Loaded: ${abiLoadStatus}`);
//     } else {
//         const abiLoadStatus = abieos.loadAbi(value.code, data);
//         console.log(`${value.code} ABI as JSON Loaded: ${abiLoadStatus}`);
//     }
// });
//
// typeTests(abieos);
//
// // stringToName
// console.log('stringToName: eosio -->', abieos.stringToName('eosio'));
//
// const serializationTests = [
//     {
//         account: 'eosio',
//         name: 'voteproducer',
//         data: {
//             voter: "voteracct111",
//             proxy: "",
//             producers: ["prod1", "prod2", "prod3"]
//         },
//         expects: '1042C80899AB32DD000000000000000003000000008090E8AD000000000091E8AD000000008091E8AD'
//     }
// ];
//
// const runSerializationTests = () => {
//     let sum = 0;
//     serializationTests.forEach((value, index) => {
//         // seriallize action data
//         const tref = process.hrtime.bigint();
//         let actionHexData;
//         let actionJsonData;
//         const type = abieos.getTypeForAction(value.account, value.name);
//         try {
//             actionHexData = abieos.jsonToHex(value.account, type, value.data);
//             // console.log(actionHexData);
//             if (actionHexData !== value.expects) {
//                 console.log(`ERROR - Got: ${actionHexData}, Expected: ${value.expects}`);
//             }
//             actionJsonData = abieos.hexToJson(value.account, type, actionHexData);
//             // console.log(actionJsonData);
//         } catch (e) {
//             console.log(e);
//         }
//         sum += Number(process.hrtime.bigint() - tref) / 1e3;
//     });
//     return sum / serializationTests.length;
// };
//
// let sum = 0;
// let totalRuns = 50;
// for (let i = 0; i < totalRuns; i++) {
//     sum += runSerializationTests();
// }
//
// console.log(`Average execution (getTypeForAction + jsonToHex + hexToJson): ${sum / totalRuns} us on ${totalRuns} runs`);
//
// // delete contract from cache, returns true or false
// const status = abieos.deleteContract("eosio");
// if (status) {
//     console.log('OK - contract deleted');
// } else {
//     console.log('ERROR - contract not found');
// }
//
// // check whether the contract was deleted
// try {
//     abieos.getTypeForAction("eosio", "voteproducer");
// } catch (e) {
//     console.log('OK - Contract context removal confirmed');
// }
