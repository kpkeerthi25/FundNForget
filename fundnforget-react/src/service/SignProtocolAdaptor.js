import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  IndexService,
  decodeOnChainData, DataLocationOnChain
} from "@ethsign/sp-sdk";

class SignProtocolAdaptor {

  getClient = () => new SignProtocolClient(SpMode.OnChain, { chain: EvmChains.baseSepolia });

  fullSchemaId = "onchain_evm_84532_0x4e3"
  schemaId = "0x4e3"
  schemaData = `[{"name":"data","type":"string"}]`

  getIndexService = () => new IndexService('testnet')

  async getAttestations(fundManagerWalletId) {
    const indexService = this.getIndexService()
    const firstpage = await indexService.queryAttestationList({
      attester: fundManagerWalletId,
      page: 1,
      schemaId: this.fullSchemaId,
      mode: "onchain",
    })
    return firstpage.rows.map((it) => this.decode(it.data).data)
  }

  async getAttestation(attestationId) {
    const attestation = await this.getClient().getAttestation(attestationId);
    return attestation.data
  }

  async createAttestation(message) {
    await this.getClient().createAttestation({
      schemaId: this.schemaId,
      data: { data: message },
      indexingValue: "xxx",
    });
  }

  decode(attestationData) {
    return decodeOnChainData(
      attestationData,
      DataLocationOnChain.ONCHAIN,
      JSON.parse(this.schemaData)
    );
  }
}

export default new SignProtocolAdaptor()
