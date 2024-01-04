// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CampaignFactory {
    address payable[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender)); //creates new contract
        deployedCampaigns.push(payable(newCampaign));
    }

    function getDeployedCampaigns() public view returns  (address payable[] memory) {
        return deployedCampaigns;
    }
}
contract Campaign {

    struct Request {
        string description;
        uint value;
        address payable recipient; //which account will receive the ether
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;

    }

    mapping(uint => Request) requests; // storage
    uint currentIndex =  0; 
    uint public requestsCount;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;  // account => bool donated or not
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _; //this line represent the function will be implemented
    }

    constructor (uint minimum, address creator)  {// creator parameter added for campaignfactory
        manager = creator;
        minimumContribution = minimum;
        requestsCount = 0; //counter for requests stored in mapping,will be used in to find the length of the mapping requests
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description,uint value, address payable recipient) public restricted{
        require(approvers[msg.sender]);
        Request storage newRequest = requests[currentIndex];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
        currentIndex++;
        requestsCount++;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]); //is user donated?
        require(!request.approvals[msg.sender]); // already gave approval
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(request.approvalCount > (approversCount/2));
        require(!request.complete);

        payable(request.recipient).transfer(request.value); 
        request.complete = true;
    }

    function getSummary() public view returns(uint,uint,uint,uint,address) {
        return(
            minimumContribution,
            address(this).balance,
            requestsCount,
            approversCount,
            manager

        );
    }

    function getRequestsCount() public view returns(uint) {
        return requestsCount;
    }

}

