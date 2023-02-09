const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Faucet', function () {
	async function deployContractAndSetVariables() {
		const Faucet = await ethers.getContractFactory('Faucet')
		const faucet = await Faucet.deploy()

		const [owner, addr1] = await ethers.getSigners()

		let withdrawAmount = ethers.utils.parseEther('1', 'ether')

		console.log(`Owner address: ${owner.address}`)
		console.log(`Signer 2 address: ${addr1.address}`)

		return { faucet, owner, addr1, withdrawAmount }
	}

	it('should deploy and set owner correctly', async function () {
		const { faucet, owner } = await loadFixture(
			deployContractAndSetVariables
		)

		expect(await faucet.owner()).to.equal(owner.address)
	})

	it('should not allow withdrawals above 1 gwei', async function () {
		const { faucet, withdrawAmount } = await loadFixture(
			deployContractAndSetVariables
		)

		expect(faucet.withdraw(withdrawAmount)).to.be.reverted
	})

	it("shouldn't destroy if selfdestruct is called by non-owner of the contract", async function () {
		const { faucet, addr1 } = await loadFixture(
			deployContractAndSetVariables
		)

		expect(faucet.connect(addr1).destroyFaucet()).to.be.revertedWith(
			'You are not the owner!'
		)
	})

	it("shouldn't empty all assets only if non-owner calls withdrawAll", async function () {
		const { faucet, addr1 } = await loadFixture(
			deployContractAndSetVariables
		)

		expect(faucet.connect(addr1).withdrawAll()).to.be.revertedWith(
			'You are not the owner!'
		)
	})

	it('should destroyFaucet work correctly', async function () {
		const { faucet } = await loadFixture(deployContractAndSetVariables)

		faucet.destroyFaucet()

		expect(await ethers.provider.getCode(faucet.address)).to.equal('0x')
	})

	it('should assign correct value to a variable called number', async function () {
		const { faucet } = await loadFixture(deployContractAndSetVariables)

		await faucet.assignNumber(74)

		const testNum = await faucet.number()

		expect(testNum).to.equal('74')
	})
})
