const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api')
const crypto = require('@polkadot/util-crypto')
const types = require('../types.json')
const bip39 = require('bip39')

const { getEntity, deleteEntity, createEntity, updateEntity, listEntities } = require('./entity')
const { createTwin, getTwin, deleteTwin, addTwinEntity, deleteTwinEntity, listTwins } = require('./twin')
const { createFarm, getFarm, deleteFarm, listFarms } = require('./farms')
const { createNode, updateNode, getNode, getNodeIDByPubkey, deleteNode, listNodes } = require('./node')
const { signEntityTwinID, signEntityCreation } = require('./sign')
const { getPrice } = require('./price')
const { vestedTransfer } = require('./vesting')
const { getBalance, transfer } = require('./balance')
const { proposeTransaction, voteTransaction, listValidators } = require('./voting')
const { createContract, cancelContract, getContract } = require('./contract')

class Client {
  constructor (url, words) {
    this.url = url
    this.words = words
    this.key = undefined
    this.address = undefined
  }

  async init () {
    const api = await getPolkaAPI(this.url)
    const keyring = new Keyring({ type: 'ed25519' })

    if (!this.words) {
      this.words = crypto.mnemonicGenerate()
    } else {
      if (!bip39.validateMnemonic(this.words)) {
        throw Error('Invalid mnemonic! Must be bip39 compliant')
      }
    }

    const key = keyring.addFromMnemonic(this.words)
    this.key = key
    console.log(`Key with address: ${this.key.address} is loaded.`)

    this.keyring = keyring
    this.address = this.key.address

    this.api = api
  }

  async sign (entityID, twinID) {
    return signEntityTwinID(this, entityID, twinID)
  }

  async signEntityCreation (name, countryID, cityID) {
    return signEntityCreation(this, name, countryID, cityID)
  }

  async updateEntity (name, countryID, cityID, callback) {
    return updateEntity(this, name, countryID, cityID, callback)
  }

  async createEntity (target, name, countryID, cityID, signature, callback) {
    return createEntity(this, target, name, countryID, cityID, signature, callback)
  }

  async getEntityByID (id) {
    return getEntity(this, id)
  }

  async listEntities () {
    return listEntities(this)
  }

  async deleteEntity (callback) {
    return deleteEntity(this, callback)
  }

  async createTwin (ip, callback) {
    return createTwin(this, ip, callback)
  }

  async getTwinByID (id) {
    return getTwin(this, id)
  }

  async listTwins () {
    return listTwins(this)
  }

  async deleteTwin (id, callback) {
    return deleteTwin(this, id, callback)
  }

  async addTwinEntity (twinID, entityID, signature, callback) {
    return addTwinEntity(this, twinID, entityID, signature, callback)
  }

  async deleteTwinEntity (twinID, entityID, callback) {
    return deleteTwinEntity(this, twinID, entityID, callback)
  }

  async createFarm (farm, callback) {
    return createFarm(this, farm, callback)
  }

  async getFarmByID (id) {
    return getFarm(this, id)
  }

  async listFarms () {
    return listFarms(this)
  }

  async deleteFarmByID (id, callback) {
    return deleteFarm(this, id, callback)
  }

  async createNode (node, callback) {
    return createNode(this, node, callback)
  }

  async updateNode (node, callback) {
    return updateNode(this, node, callback)
  }

  async getNodeByID (id) {
    return getNode(this, id)
  }

  async getNodeByPubkey (id) {
    return getNodeIDByPubkey(this, id)
  }

  async listNodes () {
    return listNodes(this)
  }

  async deleteNode (id, callback) {
    return deleteNode(this, id, callback)
  }

  async getPrice () {
    return getPrice(this)
  }

  async vest (locked, perBlock, startingBlock, tftPrice, callback) {
    return vestedTransfer(this, locked, perBlock, startingBlock, tftPrice, callback)
  }

  async getBalance () {
    return getBalance(this, this.address)
  }

  async getBalanceOf (address) {
    return getBalance(this, address)
  }

  async transfer (address, amount, callback) {
    return transfer(this, address, amount, callback)
  }

  async proposeTransaction (transactionID, to, amount, callback) {
    return proposeTransaction(this, transactionID, to, amount, callback)
  }

  async voteTransaction (transactionID, callback) {
    return voteTransaction(this, transactionID, callback)
  }

  async listValidators () {
    return listValidators(this)
  }

  async verify (message, signature, pubkey) {
    return this.key.verify(message, signature, pubkey)
  }

  async createContract (nodeID, data, deploymentHash, publicIPS, callback) {
    return createContract(this, nodeID, data, deploymentHash, publicIPS, callback)
  }

  async cancelContract (contractID, callback) {
    return cancelContract(this, contractID, callback)
  }

  async getContractByID (id) {
    return getContract(this, id)
  }
}

async function getPolkaAPI (url) {
  if (!url || url === '') {
    url = 'ws://localhost:9944'
  }

  const provider = new WsProvider(url)
  return ApiPromise.create({ provider, types })
}

module.exports = { Client }
