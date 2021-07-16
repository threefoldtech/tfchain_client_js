// createContract creates a contract
async function createContract (self, nodeID, data, hash, numberOfPublicIPs, callback) {
  const create = self.api.tx.smartContractModule.createContract(nodeID, data, hash, numberOfPublicIPs)
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return create.signAndSend(self.key, { nonce }, callback)
}

async function updateContract (self, contractID, data, hash, callback) {
  const update = self.api.tx.smartContractModule.updateContract(contractID, data, hash)
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return update.signAndSend(self.key, { nonce }, callback)
}

// createContract creates a contract
async function cancelContract (self, contractID, callback) {
  const cancel = self.api.tx.smartContractModule.cancelContract(contractID)
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return cancel.signAndSend(self.key, { nonce }, callback)
}

// getContract gets an contract by id
async function getContract (self, id) {
  try {
    id = parseInt(id)
  } catch (error) {
    throw Error('ID must be an integer')
  }
  if (isNaN(id) || id === 0) {
    throw Error('You must pass a valid ID')
  }

  const contract = await self.api.query.smartContractModule.contracts(id)

  const res = contract.toJSON()

  return res
}

module.exports = {
  createContract,
  updateContract,
  cancelContract,
  getContract
}
