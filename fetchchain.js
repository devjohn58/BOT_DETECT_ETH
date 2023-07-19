const ABI = [
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "decimals",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
];

const Web3 = require("web3");
const initial = function (contractAddress) {
	const web3 = new Web3("https://rpc.ankr.com/eth");
	const contract = new web3.eth.Contract(ABI, contractAddress);
	return { web3, contract };
};

module.exports.name = async function (contractAddress) {
	const { contract } = initial(contractAddress);
	try {
		const _name = await contract.methods.name().call();
		return _name;
	} catch (error) {
		return undefined;
	}
};

module.exports.symbol = async function (contractAddress) {
	const { contract } = initial(contractAddress);
	try {
		const _symbol = await contract.methods.symbol().call();
		return _symbol;
	} catch (error) {
		return undefined;
	}
};

module.exports.decimals = async function (contractAddress) {
	const { contract } = initial(contractAddress);
	try {
		const _decimals = await contract.methods.decimals().call();
		return _decimals;
    } catch (error) {
		return undefined;
	}
};

module.exports.totalSupply = async function (contractAddress) {
	const { contract } = initial(contractAddress);
	try {
		const _supply = await contract.methods.totalSupply().call();
		return _supply;
    } catch (error) {
		return undefined;
	}
};
