const Marketplace = artifacts.require('./Marketplace.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Marketplace', ([deployer, seller, buyer]) => {
  let marketplace

  beforeEach(async () => {
    marketplace = await Marketplace.new()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await marketplace.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
	const name = await marketplace.name()
	assert.equal(name, 'Marketplace')
    })
  })

  describe('create product', async () => {
    let result, initialCount

    beforeEach(async () => {
      initialCount = await marketplace.productCount()
      result = await marketplace.createProduct('name', web3.utils.toWei('1', 'Ether'), { from: seller })
    })
    it('creates product successfully', async () => {
      const currentCount = await marketplace.productCount()
      const event = result.logs[0].args[0]
      expect(currentCount.toNumber()).to.eql(initialCount.toNumber() + 1)
      expect([
        parseInt(event.id),
        event.name, 
        event.price, 
        event.owner, 
        event.purchased
      ]).to.eql([
        initialCount.toNumber(),
        'name',
        '1000000000000000000',
        seller,
        false
      ])
    })
    it('rejects product with empty name', async () => {
      await await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), {from: seller}).should.be.rejected
    })
    it('rejects product with 0 price', async () => {
      await await marketplace.createProduct('name', 0, {from: seller}).should.be.rejected
    })
  })

  describe('sell product', async () => {
    let result, initialCount
    beforeEach(async () => {
      initialCount = await marketplace.productCount()
      result = await marketplace.createProduct('name', web3.utils.toWei('1', 'Ether'), { from: seller })
    })
    
    it('sells an available product', async () => {
      let oldSellerBalance = new web3.utils.BN(await web3.eth.getBalance(seller))

      result = await marketplace.purchaseProduct(initialCount, {from: buyer, value: web3.utils.toWei('1', 'Ether')})
      const event = result.logs[0].args[0]
      expect([
        parseInt(event.id),
        event.name,
        event.price,
        event.owner,
        event.purchased
      ]).to.eql([
        initialCount.toNumber(),
        'name',
        '1000000000000000000',
        buyer,
        true
      ])

      let price = new web3.utils.BN(web3.utils.toWei('1', 'Ether'))
      let expectedSellerBalance = oldSellerBalance.add(price)

      let newSellerBalance = new web3.utils.BN(await web3.eth.getBalance(seller))
      expect(newSellerBalance.toString()).to.eql(expectedSellerBalance.toString())

      let product = await marketplace.products(event.id)
      expect(product.owner).to.eql(buyer)
    })
    it('rejects non-existent product', async () => {
      await marketplace.purchaseProduct(-1, {from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected
    })
    it('rejects insufficient funds', async () => {
      await marketplace.purchaseProduct(initialCount, {from: buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected
    })
    it('rejects already sold product', async () => {
      await marketplace.purchaseProduct(initialCount, {from: buyer, value: web3.utils.toWei('1', 'Ether')})
      await marketplace.purchaseProduct(initialCount, {from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected
    })
  })
})
