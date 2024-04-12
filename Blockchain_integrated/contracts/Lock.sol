// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract chai {
    struct Memo {
        string name;
        string column_name;
        uint timestamp;
        address from;
    }

    Memo[] memos;
    address payable owner; //owner is going to receive funds
    constructor() {
        owner = payable(msg.sender);
    }

    function anonymize_file(
        string calldata name,
        string calldata column_name
    ) external payable {
        require(msg.value > 0, "Please pay more than 0 ether");
        owner.transfer(msg.value);
        memos.push(Memo(name, column_name, block.timestamp, msg.sender));
    }

    function getmemos() public view returns (Memo[] memory) {
        return memos;
    }
}
