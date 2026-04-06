// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
    enum Role { None, Farmer, Distributor, Retailer, Consumer }
    enum ProductState { Created, WithDistributor, WithRetailer, Sold }

    struct User {
        address walletAddress;
        Role role;
        string name;
        bool isRegistered;
    }

    struct Product {
        uint256 id;
        string name;
        string description;
        uint256 quantity;
        string unit;
        uint256 createdAt;
        address currentOwner;
        ProductState state;
        bool exists;
    }

    struct Transaction {
        uint256 productId;
        address from;
        address to;
        uint256 price;
        uint256 timestamp;
        ProductState newState;
        string location;
    }

    mapping(address => User) public users;
    mapping(uint256 => Product) public products;
    mapping(uint256 => Transaction[]) public productHistory;
    
    uint256 public productCounter;
    address public admin;

    event UserRegistered(address indexed userAddress, Role role, string name);
    event ProductCreated(uint256 indexed productId, string name, address indexed farmer);
    event ProductTransferred(
        uint256 indexed productId,
        address indexed from,
        address indexed to,
        uint256 price,
        ProductState newState
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyRole(Role _role) {
        require(users[msg.sender].role == _role, "Unauthorized role");
        _;
    }

    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    modifier productExists(uint256 _productId) {
        require(products[_productId].exists, "Product does not exist");
        _;
    }

    constructor() {
        admin = msg.sender;
        users[admin] = User(admin, Role.None, "Admin", true);
    }

    function registerUser(address _userAddress, Role _role, string memory _name) public onlyAdmin {
        require(!users[_userAddress].isRegistered, "User already registered");
        require(_role != Role.None, "Invalid role");
        
        users[_userAddress] = User(_userAddress, _role, _name, true);
        emit UserRegistered(_userAddress, _role, _name);
    }

    function createProduct(
        string memory _name,
        string memory _description,
        uint256 _quantity,
        string memory _unit,
        string memory _location
    ) public onlyRegistered onlyRole(Role.Farmer) returns (uint256) {
        productCounter++;
        uint256 productId = productCounter;

        products[productId] = Product(
            productId,
            _name,
            _description,
            _quantity,
            _unit,
            block.timestamp,
            msg.sender,
            ProductState.Created,
            true
        );

        productHistory[productId].push(Transaction(
            productId,
            address(0),
            msg.sender,
            0,
            block.timestamp,
            ProductState.Created,
            _location
        ));

        emit ProductCreated(productId, _name, msg.sender);
        return productId;
    }

    function transferToDistributor(
        uint256 _productId,
        address _distributor,
        uint256 _price,
        string memory _location
    ) public onlyRegistered onlyRole(Role.Farmer) productExists(_productId) {
        require(users[_distributor].role == Role.Distributor, "Recipient must be distributor");
        require(products[_productId].currentOwner == msg.sender, "Not product owner");
        require(products[_productId].state == ProductState.Created, "Invalid product state");

        products[_productId].currentOwner = _distributor;
        products[_productId].state = ProductState.WithDistributor;

        productHistory[_productId].push(Transaction(
            _productId,
            msg.sender,
            _distributor,
            _price,
            block.timestamp,
            ProductState.WithDistributor,
            _location
        ));

        emit ProductTransferred(_productId, msg.sender, _distributor, _price, ProductState.WithDistributor);
    }

    function transferToRetailer(
        uint256 _productId,
        address _retailer,
        uint256 _price,
        string memory _location
    ) public onlyRegistered onlyRole(Role.Distributor) productExists(_productId) {
        require(users[_retailer].role == Role.Retailer, "Recipient must be retailer");
        require(products[_productId].currentOwner == msg.sender, "Not product owner");
        require(products[_productId].state == ProductState.WithDistributor, "Invalid product state");

        products[_productId].currentOwner = _retailer;
        products[_productId].state = ProductState.WithRetailer;

        productHistory[_productId].push(Transaction(
            _productId,
            msg.sender,
            _retailer,
            _price,
            block.timestamp,
            ProductState.WithRetailer,
            _location
        ));

        emit ProductTransferred(_productId, msg.sender, _retailer, _price, ProductState.WithRetailer);
    }

    function sellToConsumer(
        uint256 _productId,
        address _consumer,
        uint256 _price,
        string memory _location
    ) public onlyRegistered onlyRole(Role.Retailer) productExists(_productId) {
        require(users[_consumer].role == Role.Consumer, "Recipient must be consumer");
        require(products[_productId].currentOwner == msg.sender, "Not product owner");
        require(products[_productId].state == ProductState.WithRetailer, "Invalid product state");

        products[_productId].currentOwner = _consumer;
        products[_productId].state = ProductState.Sold;

        productHistory[_productId].push(Transaction(
            _productId,
            msg.sender,
            _consumer,
            _price,
            block.timestamp,
            ProductState.Sold,
            _location
        ));

        emit ProductTransferred(_productId, msg.sender, _consumer, _price, ProductState.Sold);
    }

    function getProduct(uint256 _productId) public view productExists(_productId) returns (Product memory) {
        return products[_productId];
    }

    function getProductHistory(uint256 _productId) public view productExists(_productId) returns (Transaction[] memory) {
        return productHistory[_productId];
    }

    function getUser(address _userAddress) public view returns (User memory) {
        return users[_userAddress];
    }

    function getUserRole(address _userAddress) public view returns (Role) {
        return users[_userAddress].role;
    }

    function getProductCount() public view returns (uint256) {
        return productCounter;
    }
}
