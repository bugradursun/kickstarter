//access campaignfactory with this script
import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0x8f97eE9469D1E44359CfdC7F6e5F87964f4210b0'
)

export default instance;

