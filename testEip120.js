const {signTypedData, SignTypedDataVersion} = require("@metamask/eth-sig-util");
const ethers = require("ethers");

const domain = {
  name: "name",
  version: "1",
  verifyingContract: "0xB6Fa4E9B48F6fAcd8746573d8e151175c40121C7",
  chainId: 1,
};

const types = {
  Test: [{name: "Request", type: "string"}],
};

const types2 = {
  Test: [{name: "Request", type: "string"}],
  EIP712Domain: [
    {name: "name", type: "string"},
    {name: "version", type: "string"},
    {name: "chainId", type: "uint256"},
    {name: "verifyingContract", type: "address"},
  ],
};

const privateKey = Buffer.from(
  "9af0e6fcc9c1cd750d8bc98c27d2b32e4df86781e5ccefc1e11f75b8010ec442",
  "hex"
);

const signature2 = signTypedData({
  privateKey,
  data: {
    types: types2,
    primaryType: "Test",
    domain,
    message: {
      Request: "This is a request",
    },
  },
  version: SignTypedDataVersion.V4,
});
console.log("Metamask sig utils generated signature", signature2);

const wallet = new ethers.Wallet(privateKey);

wallet
  ._signTypedData(domain, types, {
    Request: "This is a request",
  })
  .then((signature) => {
    console.log("Ether js _signTypedData", signature);
  });
