// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Kickstart {
    struct Campaign {
        string title;
        string description;
        uint256 goal;
        uint256 funds;
        address owner;
        uint256 promotions;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => address[]) public donors;
    mapping(uint256 => mapping(address => uint256)) public donations;
    uint256 public campaignCount;

    event CampaignCreated(
        uint256 indexed id,
        address indexed owner,
        string title,
        uint256 goal
    );
    event Donated(
        uint256 indexed id,
        address indexed donor,
        uint256 amount,
        uint256 totalFunds
    );
    event Promoted(
        uint256 indexed id,
        uint256 totalPromotions
    );

    constructor() {
        // nothing special here
    }

    function createCampaign(
        string calldata _title,
        string calldata _description,
        uint256 _goal
    ) external returns (uint256 id) {
        require(_goal > 0, "Goal must be > 0");
        campaignCount += 1;
        id = campaignCount;
        campaigns[id] = Campaign({
            title: _title,
            description: _description,
            goal: _goal,
            funds: 0,
            owner: msg.sender,
            promotions: 0
        });
        emit CampaignCreated(id, msg.sender, _title, _goal);
    }

    function donate(uint256 _id) external payable {
        require(msg.value > 0, "Donation must be > 0");
        Campaign storage c = campaigns[_id];
        require(c.owner != address(0), "Campaign does not exist");
        c.funds += msg.value;
        if (donations[_id][msg.sender] == 0) {
            donors[_id].push(msg.sender);
        }
        donations[_id][msg.sender] += msg.value;
        emit Donated(_id, msg.sender, msg.value, c.funds);
    }

    function promote(uint256 _id) external {
        Campaign storage c = campaigns[_id];
        require(c.owner == msg.sender, "Only owner can promote");
        c.promotions += 1;
        emit Promoted(_id, c.promotions);
    }

    // Splintered getters to stay under the stack limit

    function getCampaignCore(uint256 _id)
        external
        view
        returns (
            string memory title,
            string memory description,
            uint256 goal,
            uint256 funds,
            address owner,
            uint256 promotions
        )
    {
        Campaign storage c = campaigns[_id];
        return (
            c.title,
            c.description,
            c.goal,
            c.funds,
            c.owner,
            c.promotions
        );
    }

    function getDonors(uint256 _id)
        external
        view
        returns (address[] memory)
    {
        return donors[_id];
    }

    function getCampaignCount() external view returns (uint256) {
        return campaignCount;
    }
}
