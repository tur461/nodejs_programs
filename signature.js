require('dotenv').config();
const sigUtil = require('eth-sig-util');
const web3 = require('web3');
const {ethers} = require('ethers');
const {signTypedData, SignTypedDataVersion} = require('@metamask/eth-sig-util');

const PVT_KEY = Buffer.from(
    process.env.PVT_KEY_PIYUSH,
    "hex"
);

const NONCE = '4';
const CHAIN_ID = '1';
const DEADLINE = '1661869207';
const VALUE = '1399529268900';
const OWNER = '0x6d8fc390502e8e028ffd5659940c69a21d6430d7';
const SPENDER = '0x0c17e776CD218252ADFca8D4e761D3fe757e9778';
const VERIFY_CONTRACT = '0x5716D2cbF2f44b5b9e3Ed7b7a6eB58Ce5996F318';


const Sig = {
    r: '0xef9b7d1c0ace1f327ba0fef4835a27dffbf8288096ce9ae00bc03978d537f711',
    s: '0x0f072fa5fdf2f6dbe2460a1388aceeea0931ffbe442dd692372248ccd7b29da3',
    v: 27,  
}
const Sig1 = {
    r: '"0x947569585032c0bfa75fe7dd6ed83c8a4b9063548285c728396d02815039ab31"',
    s: '"0x1180aec563832c9078296346639d4eaef5404f357dc08ddd014a1e633d4600d0"',
    v: 27,  
}

function getEncoded(typesArr, paramsArr) {
    return web3.eth.abi.encodeParameters(typesArr, paramsArr);   
}

async function createSignature() {
    const version = '1';
    const chainId = CHAIN_ID;
    const name = 'SaitaSwap LPs';
    const value = VALUE;
    const deadLine = DEADLINE;
    const owner = OWNER;
    const spender = SPENDER;
    const verifyingContract = VERIFY_CONTRACT;

    const domainParams = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" }
    ]
    const permitParams = [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },

    ];
    const domainValues = {
        name,
        version,
        value,
        chainId,
        verifyingContract,
    };
    const content = {
        owner,
        spender,
        value,
        nonce: web3.utils.toHex(NONCE),
        deadline: deadLine,
    };
    const data = {
        types: {
            EIP712Domain: domainParams,
            Permit: permitParams,
        },
        domain: domainValues,
        primaryType: "Permit",
        message: content,
    };
    JSON.stringify(data);

    'eth_sign_v4'

    const mMaskSig = signTypedData({
        data,
        privateKey: PVT_KEY,
        version: SignTypedDataVersion.V4,
    });
    const wallet = new ethers.Wallet(PVT_KEY);
    
    const pTypes = {
        Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
    
        ]
    };
    
    const domainVals = {
        name, // contract deploy name
        version, // contract deploy version
        chainId, // env chain id
        verifyingContract,
    };
    const ethersSig = await wallet._signTypedData(domainVals, pTypes, data.message)
    
    console.log('\nEther js _signTypedData:\n' + ethersSig);
    const splitsEth = ethers.utils.splitSignature(ethersSig);
    console.log('\nSplits:\n', splitsEth);

    console.log('\nMetamask sig utils generated signature:\n' + mMaskSig);
    console.log('\nSplits:\n', );
    const recoveredMM = sigUtil.recoverTypedSignature_v4({
        data: data,
        sig: ethersSig
    });
    
    console.log('\nrecovered:', recoveredMM);
    // const x = {
    //     "method": "eth_signTypedData_v4",
    //     "params": [
    //         "0x9d8a62f656a8d1615c1294fd71e9cfb3e4855a4f",
    //         "{\"domain\":{\"chainId\":1,\"name\":\"Ether Mail\",\"verifyingContract\":\"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC\",\"version\":\"1\"},\"message\":{\"contents\":\"Hello, Bob!\",\"from\":{\"name\":\"Cow\",\"wallets\":[\"0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826\",\"0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF\"]},\"to\":[{\"name\":\"Bob\",\"wallets\":[\"0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB\",\"0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57\",\"0xB0B0b0b0b0b0B000000000000000000000000000\"]}]},\"primaryType\":\"Mail\",\"types\":{\"EIP712Domain\":[{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"version\",\"type\":\"string\"},{\"name\":\"chainId\",\"type\":\"uint256\"},{\"name\":\"verifyingContract\",\"type\":\"address\"}],\"Group\":[{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"members\",\"type\":\"Person[]\"}],\"Mail\":[{\"name\":\"from\",\"type\":\"Person\"},{\"name\":\"to\",\"type\":\"Person[]\"},{\"name\":\"contents\",\"type\":\"string\"}],\"Person\":[{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"wallets\",\"type\":\"address[]\"}]}}"
    //     ],
    //     "id": 1621843180588
    // }
    // console.log('data', JSON.parse(x.params[1]));

}

function getSplits(sig) {
    return {

    }
}

function verifySignature() {

}

createSignature().then().catch(e => console.log(e));