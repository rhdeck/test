pragma solidity ^0.7.4;
pragma experimental ABIEncoderV2;

/*import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/24a0bc23cfe3fbc76f8f2510b78af1e948ae6651/contracts/token/ERC20/extensions/ERC20Burnable.sol";*/
// SPDX-License-Identifier: MIT

contract Token {
    uint8 public decimals;
    uint256 public totalSupply;
    uint256 public constant MINT_AMT = 1e9;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    string public name;
    string public symbol;

    event Transfer(address _from, address _to, uint256 _value);

    event Approval(address _owner, address _spender, uint256 _value);

    constructor() {
        balanceOf[msg.sender] = MINT_AMT;
        totalSupply = MINT_AMT;
        name = "SportEth Token";
        decimals = 4;
        symbol = "SET";
    }

    function approve(address _spender, uint256 _value)
        external
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transfer(address _recipient, uint256 _value)
        external
        returns (bool success)
    {
        uint256 senderBalance = balanceOf[msg.sender];
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] = senderBalance - _value;
        balanceOf[_recipient] += _value;
        emit Transfer(msg.sender, _recipient, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _recipient,
        uint256 _value
    ) public returns (bool success) {
        uint256 senderBalance = balanceOf[_from];
        require(
            balanceOf[_from] >= _value && allowance[_from][msg.sender] >= _value
        );
        balanceOf[_from] = senderBalance - _value;
        balanceOf[_recipient] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _recipient, _value);
        return true;
    }


}
