
const URL = {
    PROVIDER: 'http://localhost:8448/',
}

const ADDR = {
    ZERO: '0x' + '0'.repeat(40),
    SAFE_OWNER: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    // GNOSIS_SAFE: '0x' + '0'.repeat(40),
    GNOSIS_SAFE: '0x51b5A48dc420877336e7541e0b62a974C8438ea4',
}

const CHAIN_ID = {
    ETHEREUM: 1,
    HARDHAT: 31337,
    MUM_POLY: 8001,
}

const END = {
    BACK: 0,
    FRONT: 1,
}

const METH = {
    EXEC_TX: 'execTransaction',
}

module.exports = {
    URL,
    END,
    METH,
    ADDR,
    CHAIN_ID,
}