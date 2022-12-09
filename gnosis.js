const { ethers } = require('ethers');
const {get_dummy_data} = require('./utils/gsafe');
const {URL, ADDR, CHAIN_ID} = require('./constants/gsafe');
const sigUtil = require('eth-sig-util');

// from GnosisSafe.sol
const EIP712_DOMAIN = 'EIP712Domain(uint256 chainId,address verifyingContract)';
const SAFE_TX = 'SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)';

// must be the key name of 
// message type in types sub-object of 
// typedData (see below)
const PRI_TYPE = 'SafeTx';

// from gnosis-safe-sdk
const EIP712_DOMAIN_TYPE = [
    { type: 'uint256', name: 'chainId' },
    { type: 'address', name: 'verifyingContract'}
]

const SAFE_TX_TYPE = [
    { type: 'address', name: 'to' },
    { type: 'uint256', name: 'value' },
    { type: 'bytes', name: 'data' },
    { type: 'uint8', name: 'operation' },
    { type: 'uint256', name: 'safeTxGas' },
    { type: 'uint256', name: 'baseGas' },
    { type: 'uint256', name: 'gasPrice' },
    { type: 'address', name: 'gasToken' },
    { type: 'address', name: 'refundReceiver' },
    { type: 'uint256', name: 'nonce' }
]

const get_types = _ => {
    return {
        // EIP712Domain is same as EIP712Domain in const EIP712_DOMAIN
        EIP712Domain: EIP712_DOMAIN_TYPE,
        // SafeTx is same as SafeTx in const SAFE_TX
        SafeTx: SAFE_TX_TYPE,
    }
}

const get_domain_type_values = _ => {
    return {
        // chain id of blockchain contract deployed on. 
        chainId:  CHAIN_ID.HARDHAT,
        // address of the contract verifying the signature.
        verifyingContract: ADDR.GNOSIS_SAFE,
    }
}

const get_primary_type_values = _ => {
    const d = get_dummy_data();
    return {
        to: d.to,
        value: d.value,
        data: d.data,
        operation: d.operation,
        safeTxGas: d.safeTxGas,
        baseGas: d.baseGas,
        gasPrice: d.gasPrice,
        gasToken: d.gasToken,
        refundReceiver: d.refundReceiver,
        nonce: d.nonce,
    }
}

const get_typed_data = _ => {
    return {
        types: get_types(),
        // the key-name from the types object above whose 
        // values are to be passed in the message below
        primaryType: PRI_TYPE,
        // object
        domain: get_domain_type_values(),
        // object
        message: get_primary_type_values(),
    }
}

async function generate_sign_using_frontend(td) {
    // const web3Provider = window.ethereum;
    // const provider = new ethers.providers.Web3Provider(web3Provider)
    
}

async function generate_sign_using_backend(td) {
    const urlInfo = {
        url: URL.PROVIDER,
        allowInsecure: !0,
    }
    const provider = new ethers.providers.JsonRpcProvider(urlInfo);
    const safeOwner = provider.getSigner(0);
    console.log('got provider and singer!');
    const signature = await safeOwner._signTypedData(
        td.domain,
        { [PRI_TYPE]: td.types[PRI_TYPE] },
        td.message
    );
    console.log('signature:', signature, signature.slice(2).length/2);
    return signature;
}

async function main() {
    const typedData = get_typed_data();
    // console.log('td:', typedData);
    // await generate_sign_using_frontend(typedData);
    //const sign = await generate_sign_using_backend(typedData);
    const sign = '0xdc221434faaa4e3a3b644949c456fda186e30f68c34e7f278fa2e2b4c2a47a4c33c980d9dcbc3a3d2613adb000e796608aa66ba434d3e4bccf1eee02e08069fa1b';
    const splits = ethers.utils.splitSignature(sign);
    console.log('splits:', splits);
    const recovered = sigUtil.recoverTypedSignature_v4({
        data: typedData,
        sig: sign
    });
    console.log('recovered:', recovered);
}

main()
.then(_ => _)
.finally(_ => console.log('\ncompleted'))
