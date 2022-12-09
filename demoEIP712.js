const { owner, spender, deadline, value } = d;
const web3 = await ContractServices.callWeb3();

let chainId = await web3.currentProvider.chainId;
chainId = await web3.utils.hexToNumber(chainId);

const nonce = await getPairNonces(pair, owner);

const EIP712Domain = [
	{ name: "name", type: "string" },
	{ name: "version", type: "string" },
	{ name: "chainId", type: "uint256" },
	{ name: "verifyingContract", type: "address" },
];
const domain = {
  name: "Uniswap V2",
  version: "1",
  value,
  chainId,
  verifyingContract: pair,
};
const Permit = [
  { name: "owner", type: "address" },
  { name: "spender", type: "address" },
  { name: "value", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "deadline", type: "uint256" },
];
const message = {
  owner,
  spender,
  value,
  nonce: web3.utils.toHex(nonce),
  deadline,
};
const data = JSON.stringify({
  types: {
    EIP712Domain,
    Permit,
  },
  domain,
  primaryType: "Permit",
  message,
});

//old function
// const res = await web3.currentProvider.send('eth_signTypedData_v4', [owner, data]);
// console.log(data, res, 'before---------------')

const from = owner;
const params = [from, data];
const method = "eth_signTypedData_v4";

const res = await web3.currentProvider.request({
  method,
  params,
  from,
});