import Web3 from "web3";

const endpoint = "https://sepolia.infura.io/v3/5f1fb91ece9f4756b8e772fa4ac3d604"
let web3;
//window object is used to check if we are running on the browser or on the server
//if window object exists => we are on the browser
if(typeof window!=='undefined' && typeof window.web3!=='undefined') { //if user is on browser and running metamask
    web3 = new Web3(window.web3.currentProvider)
} else {
    const provider = new Web3.providers.HttpProvider(endpoint) //user is not running metamask
    web3 = new Web3(provider)
}

export default web3;