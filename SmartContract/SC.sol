//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
interface IERC20 {
    function transferFrom(address sender, address recipient, uint amount) external returns (bool);
}

contract CrowdX {
    uint public campaignCounter;
    address private companyOwner;
    

    event CampaignCreated(uint campaignID, string name, string milestone, uint goal);

    struct Campaign { //storing campaign information
        string campaignName;
        string milestoneName;
        uint goal;
    }

    mapping(uint => Campaign) public campaignID; //we tie struct "Campaing" to uint campaignID, for campaing indexing
    mapping(address => bool) public approvedToken;

    constructor( ){
        //approvedToken[0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48] = true; //USDC contract address

    }

    function createCampaign(string memory _name, string memory _milestoneName, uint _value) public {
        campaignID[campaignCounter] = Campaign(_name, _milestoneName, _value); //storing incoming js variables in the Campaign struct
        //also, since struct is not stored on blockchain, we have to store it in the mapping with the counter of campaigns -> campaignID[cCounter]...etc
        emit CampaignCreated(campaignCounter, _name, _milestoneName, _value);

        campaignCounter++; //it counts (indexing) the new coming campaings
        
    }

    function donateERC20(address token, uint amount, uint id) public {
        require(approvedToken[token], "Token not approved");
        require(campaignID[id].goal > 0, "Campaign does not exist");

        IERC20(token).transferFrom(msg.sender, address(this), amount);
    }


}