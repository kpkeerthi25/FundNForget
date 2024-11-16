import * as LitJsSdk from "@lit-protocol/lit-node-client";
import {
  LitAbility,
  LitAccessControlConditionResource,
  createSiweMessage,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { LIT_RPC } from "@lit-protocol/constants";
import * as ethers from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";

const evmContractConditions = [
  {
    contractAddress: "0xa0c8c1EC51D814B16759b971DfBe198DdD6E78a7",
    functionName: "isValid",
    chain: "baseSepolia",
    functionParams: [],
    functionAbi: {
      "inputs": [],
      "name": "getValue",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    returnValueTest: {
      key: "",
      comparator: "=",
      value: "true",
    },
  },
];

const privateKey = "b727f8581f6684a3f098c3650043d73c452dca51524aca3cfc29ca33149252d3";

const ethersSigner = new ethers.Wallet(
  privateKey,
  new JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);

class LitProtocolAdaptor {
  litNodeClient;
  chain;

  constructor(chain) {
    this.chain = chain;
  }

  async connect() {
    this.litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
      alertWhenUnauthorized: false,
      litNetwork: "datil-dev",
      debug: true,
    });

    await this.litNodeClient.connect();
  }

  async encrypt(message) {
    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
      {
        evmContractConditions,
        dataToEncrypt: message,
      },
      this.litNodeClient
    );

    return {
      ciphertext,
      dataToEncryptHash,
    };
  }

  async decrypt(ciphertext, dataToEncryptHash) {
    const sessionSigs = await this.litNodeClient.getSessionSigs({
      chain: "baseSepolia",
      expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
      resourceAbilityRequests: [
        {
          resource: new LitAccessControlConditionResource("*"),
          ability: LitAbility.AccessControlConditionDecryption,
        },
      ],
      authNeededCallback: async ({
        uri,
        expiration,
        resourceAbilityRequests,
      }) => {
        const toSign = await createSiweMessage({
          uri,
          expiration,
          resources: resourceAbilityRequests,
          walletAddress: ethersSigner.address,
          nonce: await this.litNodeClient.getLatestBlockhash(),
          litNodeClient: this.litNodeClient,
        });

        return await generateAuthSig({
          signer: ethersSigner,
          toSign,
        });
      },
    });

    const decryptedString = await LitJsSdk.decryptToString(
      {
        evmContractConditions,
        chain: this.chain,
        ciphertext,
        dataToEncryptHash,
        sessionSigs

      },
      this.litNodeClient,
    ).catch(e => console.log(e));

    console.log("decrypted String: ", decryptedString)
    return decryptedString
  }
}

export default new LitProtocolAdaptor()