const path = require('path')
const solc =  require('solc')
const fs = require('fs-extra')

const buildPath = path.resolve(__dirname,'build')
fs.removeSync(buildPath) //delete if anything exists inside build

const campaignPath = path.resolve(__dirname,'contracts','Campaign.sol')
const source = fs.readFileSync(campaignPath,'utf-8') //contents of campaign.sol

const input = {
    language: 'Solidity',
    sources: {
        'Campaign.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
};
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    "Campaign.sol"
  ];
fs.ensureDirSync(buildPath)

for(let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath,contract + '.json'),
        output[contract]
    )
}