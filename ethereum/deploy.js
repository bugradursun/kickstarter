const HDWalletProvider = require('@truffle/hdwallet-provider')
const {Web3} = require('web3')
const compiledFactory = require("./build/CampaignFactory.json")


const provider = new HDWalletProvider(
    'farm earn idea left donor maze visual acoustic approve traffic tribe tower', //account mnemonic
    'https://sepolia.infura.io/v3/5f1fb91ece9f4756b8e772fa4ac3d604' //endpoint for sepolia
)

const web3 =new Web3(provider)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts()
    console.log("Attempting to deploy from account:", accounts[0])

    const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: "1400000", from: accounts[0] });

    console.log("Contract deployed to",result.options.address)
    provider.engine.stop()
}
//DEPLOYED BY 0x86DA2AfBe849B550e02F9Cfe91E8DE687B05CF28 udemy-eth hesabi
//DEPLOYED TO 0x8f97eE9469D1E44359CfdC7F6e5F87964f4210b0 CAMPAIGN FACTORY

deploy()