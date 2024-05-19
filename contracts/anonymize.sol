// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract anonymize {
    struct Memo {
        string user_name;
        string file_name;
        string[] column_names;
        uint timestamp;
        address from;
    }

    Memo[] memos;
    address payable owner; //owner is going to receive funds
    constructor() {
        owner = payable(msg.sender);
    }

    function anonymize_columns(
        string calldata user_name,
        string calldata file_name,
        string[] calldata column_names
    ) external payable {
        require(msg.value > 0, "Please pay more than 0 ether");
        owner.transfer(msg.value);
        memos.push(
            Memo(
                user_name,
                file_name,
                column_names,
                block.timestamp,
                msg.sender
            )
        );
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
