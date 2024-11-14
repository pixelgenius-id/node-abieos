import {Abieos} from "@eosrio/node-abieos";
import {ABI, Serializer} from "@wharfkit/antelope";

const abieos = Abieos.getInstance();

const abi = ABI.from({
    types: [
        {
            new_type_name: "vec_string",
            type: "string[]"
        },
        {
            new_type_name: "vec_uint8",
            type: "uint8[]"
        }
    ],
    structs: [
        {
            name: "nested",
            base: "",
            fields: [
                {name: "string_vec", type: "string[]"},
                {name: "string_vec_nested", type: "vec_string[]"},
                {name: "uint8_vec_nested", type: "vec_uint8[]"}
            ]
        }
    ],
});

const testObject = {
    string_vec: ["A", "B"],
    string_vec_nested: [["A1", "B1"], ["A2", "B2"]],
    uint8_vec_nested: [[1, 2], [3, 4]]
};

const inputString = JSON.stringify(testObject);

console.log("Test Data", testObject);

const serializedData = Serializer.encode({
    abi,
    type: "nested",
    object: testObject
});

const hexData = serializedData.toString('hex');

console.log("HEX Data", hexData);

const deserializedData = Serializer.decode({
    abi,
    type: 'nested',
    data: hexData
});

console.log("Deserialized Data (Wharfkit)", Serializer.objectify(deserializedData));

// loading ABI
const status = abieos.loadAbi('test', abi.toJSON());
if (status) {
    const abieosDecoded = abieos.hexToJson('test', 'nested', hexData);
    console.log("Deserialized Data (ABIEOS)", abieosDecoded);
    const outputString = JSON.stringify(abieosDecoded);
    if (outputString !== inputString) {
        console.error(`Input / Output Mismatch`);
    } else {
        console.log('Test Completed!');
    }
}
