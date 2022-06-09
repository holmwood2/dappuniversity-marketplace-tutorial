pragma solidity ^0.8.0;

contract Marketplace {
  string public name = "Marketplace";
  uint public productCount = 0;
  mapping(uint => Product) public products;

  struct Product {
    uint id;
    string name;
    uint price;
    address payable owner;
    bool purchased;
  }

  event ProductCreated(Product product);
  event ProductPurchased(Product product);

  function createProduct(string memory _name, uint _price) public {
    require(bytes(_name).length > 0);
    require(_price > 0);
    Product memory product = Product(productCount, _name, _price, payable(msg.sender), false);
    products[productCount] = product;
    productCount++;
    emit ProductCreated(product);
  }

  function purchaseProduct(uint _id) public payable {
    require(_id >= 0);
    require(_id < productCount);

    Product memory _product = products[_id];
    address payable _buyer = payable(msg.sender);

    require(!_product.purchased);
    require(_buyer != _product.owner);
    require(msg.value >= _product.price);
    if (msg.value > _product.price) {
      _buyer.transfer(msg.value - _product.price);
    }
    _product.owner.transfer(_product.price);
    _product.purchased = true;
    _product.owner = _buyer;
    products[_id] = _product;

    emit ProductPurchased(_product);
  }
}
