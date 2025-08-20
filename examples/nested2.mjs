import {Abieos} from "@pixelgeniusid/node-abieos";
import {ABI, Serializer} from "@wharfkit/antelope";

const abieos = Abieos.getInstance();

const eosioNftFt = await fetch("https://ultra.pixelgeniusid.id/v1/chain/get_abi",{
    method: "POST",
    body: JSON.stringify({
        account_name: "vex.nft.ft",
        json: true
    })
});

const abiData = JSON.stringify((await eosioNftFt.json()).abi);

// loading ABI
const status = abieos.loadAbi('vex.nft.ft', abiData);

process.exit();

// const abi = ABI.from({
//     types: [
//         {
//             new_type_name: "vec_string",
//             type: "string[]"
//         },
//         {
//             new_type_name: "vec_uint8",
//             type: "uint8[]"
//         }
//     ],
//     structs: [
//         {
//             name: "nested",
//             base: "",
//             fields: [
//                 {name: "string_vec", type: "string[]"},
//                 {name: "string_vec_nested", type: "vec_string[]"},
//                 {name: "uint8_vec_nested", type: "vec_uint8[]"}
//             ]
//         }
//     ],
// });
//
// const testObject = {
//     string_vec: ["A", "B"],
//     string_vec_nested: [["A1", "B1"], ["A2", "B2"]],
//     uint8_vec_nested: [[1, 2], [3, 4]]
// };
//
// const inputString = JSON.stringify(testObject);
//
// console.log("Test Data", testObject);
//
// const serializedData = Serializer.encode({
//     abi,
//     type: "nested",
//     object: testObject
// });
//
// const hexData = serializedData.toString('hex');
//
// console.log("HEX Data (from Wharfkit)\n", hexData);
//
// const deserializedData = Serializer.decode({
//     abi,
//     type: 'nested',
//     data: hexData
// });
//
// console.log("Deserialized Data (Wharfkit)", Serializer.objectify(deserializedData));
//
// // loading ABI
// const status = abieos.loadAbi('test', abi.toJSON());
// if (status) {
//
//     // deserialize
//     const abieosDecoded = abieos.hexToJson('test', 'nested', hexData);
//     console.log("Deserialized Data (ABIEOS)", abieosDecoded);
//     if (JSON.stringify(abieosDecoded) !== inputString) {
//         console.error(`Input / Output Mismatch`);
//     } else {
//         console.log('JSON Data Matched!');
//     }
//
//     // serialize again
//     const abieosEncoded = abieos.jsonToHex('test', 'nested', abieosDecoded);
//     console.log("HEX Data (ABIEOS)\n", abieosEncoded);
//     if (hexData !== abieosEncoded) {
//         console.error(`Hex Data Mismatch`);
//     } else {
//         console.log('HEX Data Matched!');
//     }
// }
