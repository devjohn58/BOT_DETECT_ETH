const express = require("express");
const app = express();
const port = 3000;
const ethers = require("ethers");
const { formatEther } = require("ethers");
const { symbol, name, decimals, totalSupply } = require("./fetchchain");
const { default: axios } = require("axios");
const Web3 = require("web3");

const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
const web3Socket = new Web3(
	"wss://proud-white-yard.quiknode.pro/1ed81f6cc7d240e48f5b5a26a9df52562e577262/"
);
const web3 = new Web3("https://eth.llamarpc.com");

//============CUSTOM=====================
async function sendMessage(
	contractToken,
	name_,
	symbol_,
	owner,
	balance,
	supply_,
	decimals_
) {
	const url =
		"https://api.telegram.org/bot6309924933:AAH_cD6qERzUh-5AvotjL4xrhchGw1HMbDQ/sendMessage";
	const data = {
		chat_id: "@detectethprivate",
		text: `🕵🏻‍♂️  *New Token Found*
👤  Name:  *${name_}*
🫂  Symbol:  *${symbol_}*
🧚  \`${contractToken}\`
📈  Contract:   [View Contract](https://etherscan.io/address/${contractToken})
👩‍💻  Owner:     [${owner}](https://etherscan.io/address/${owner})
💵  Balance:   *${balance}* ETH
🥮  Supply:    ${Number(supply_).toLocaleString()} (+${decimals_} decimals)
✋  Action: [Meastro](tg://resolve?domain=MaestroSniperBot&start=${contractToken}) | [MeastroPro](tg://resolve?domain=MaestroProBot&start=${contractToken}) | [Otto Simulator](tg://resolve?domain=OttoSimBot&start=${contractToken})`,
		parse_mode: "MarkDown",
		disable_web_page_preview: 1,
	};
	try {
		await axios.post(url, data);
		return;
	} catch (error) {
		await axios.post(url, {
			chat_id: "@detectethprivate",
			text: `Error Send Mess Telegram
            Error: ${error}`,
		});
	}
}

async function getpair(_contract, _owner) {
    // get info token
    const _symbol = await symbol(_contract);
	const _name = await name(_contract);
	const _decimals = await decimals(_contract);
	const supplyres = await totalSupply(_contract);
	const _supply = supplyres && supplyres.slice(0, supplyres.length - Number(_decimals));
	const getBalance = await provider.getBalance(_owner);
	const _balance = formatEther(getBalance);
    
    if (!_symbol || !_name || !_decimals || !_supply) return;
	//send message to telegram
	console.log("Start Sending: ", _name);
	await sendMessage(
		_contract,
		_name,
		_symbol,
		_owner,
		Number(_balance).toFixed(3),
		_supply,
		_decimals
	);
}

function _waitForTransaction(tx) {
	try {
		provider
			.getTransaction(tx)
			.then((txnData) => {
				if (txnData && (txnData["data"].includes("0x6"))) {
					web3.eth
						.getTransactionReceipt(txnData["hash"])
						.then((txn) => {
							if (txn && txn["contractAddress"] && txn["from"]) {
								getpair(txn["contractAddress"], txn["from"]);
							}
						});
				}
			})
			.catch((err) => {
				console.log("err wait: ", err);
			});
	} catch (error) {
		console.log("error wait: ", error);
	}
}

function func() {
	console.clear();
	console.log("============RUNNING===============");
	// provider.on("pending", async (tx) => {
	//     _waitForTransaction(tx)
	// });
	web3Socket.eth.subscribe("newBlockHeaders", (err, result) => {
		const { number } = result;
		web3.eth.getBlock(number).then((_result) => {
			const _txs = _result?.transactions;
			if (_txs) {
				for (let i = 0; i < _txs.length; i++) {
					_waitForTransaction(_txs[i]);
				}
			}
		});
	});
}
function main() {
	try {
		func();
	} catch (error) {
		main();
	}
}
app.listen(port, async function (error) {
	main();
});
