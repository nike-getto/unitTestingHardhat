const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const { expect } = require('chai')

describe('Faucet', function () {
	async function deployContractAndSetVariables() {
		const Faucet = await ethers.getContractFactory('Faucet')
		const faucet = await Faucet.deploy()

		const [owner] = await ethers.getSigners()

		let withdrawAmount = ethers.utils.parseEther('1', 'ether')

		console.log(`Signer 1 address: ${owner.address}`)

		return { faucet, owner, withdrawAmount }
	}

	it('should deploy and set owner correctly', async function () {
		const { faucet, owner } = await loadFixture(
			deployContractAndSetVariables
		)

		expect(await faucet.owner()).to.equal(owner.address)
	})

	it('should not allow withdrawals above 1 gwei', async function () {
		const { faucet, owner, withdrawAmount } = await loadFixture(
			deployContractAndSetVariables
		)

		await expect(faucet.withdraw(withdrawAmount)).to.be.reverted
	})

	it('should only destroy if owner calls selfdestruct', async function () {
		const { faucet, owner } = await loadFixture(
			deployContractAndSetVariables
		)

		// TODO: Finish this it clause
	})
})
