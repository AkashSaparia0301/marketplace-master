pragma solidity ^0.5.0;

contract GoldMarketplace {
    string public name;
    uint public GoldCount = 0;
    mapping(uint => Gold) public Golds;
    string public color;
    uint public karat;
    uint public purity;
    uint public tola;
    

    struct Gold {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
        string color;
        uint karat;
        uint purity;
        uint tola;
    }
    
    

    event GoldCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased,
        string color,
        uint karat,
        uint purity,
        uint tola
    );

    event GoldPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased,
        string color,
        uint karat,
        uint purity,
        uint tola
    );

    constructor() public {
        name = "Gold";
    }

    
    
    function createGold(string memory _name, uint _price , string memory _color, uint _karat, uint _purity, uint _tola ) public {
        // Require a valid name
        require(bytes(_name).length > 0);
        // Require a valid price
        require(_price > 0);
        require(bytes(_color).length > 0);
        require(_karat >0);
        require(_tola >0);
        require(_purity >0);
        // Increment product count
        GoldCount ++;
        // Create the product
        Golds[GoldCount] = Gold(GoldCount, _name, _price, msg.sender, false,_color,_karat,_purity,_tola);
        // Trigger an event
        emit GoldCreated(GoldCount, _name, _price, msg.sender, false,_color,_karat,_purity,_tola);
    }

    function purchaseGold(uint _id) public payable {
        // Fetch the product
        Gold memory _Gold = Golds[_id];
        // Fetch the owner
        address payable _seller = _Gold.owner;
        // Make sure the product has a valid id
        require(_Gold.id > 0 && _Gold.id <= GoldCount);
        // Require that there is enough Ether in the transaction
        require(msg.value >= _Gold.price);
        // Require that the product has not been purchased already
        require(!_Gold.purchased);
        // Require that the buyer is not the seller
        require(_seller != msg.sender);
        // Transfer ownership to the buyer
        _Gold.owner = msg.sender;
        // Mark as purchased
        _Gold.purchased = true;
        // Update the product
        Golds[_id] = _Gold;
        // Pay the seller by sending them Ether
        address(_seller).transfer(msg.value);
        // Trigger an event
        emit GoldPurchased(GoldCount, _Gold.name, _Gold.price, msg.sender, true,_Gold.color,_Gold.karat,_Gold.purity,_Gold.tola);
    }
    
    function GoldDetails(uint _id) public view returns(string memory, uint,address, string memory, uint,uint,uint) {
        Gold memory _Gold = Golds[_id];
        return (_Gold.name, _Gold.price, _Gold.owner,_Gold.color,_Gold.karat,_Gold.purity,_Gold.tola);
    }
}