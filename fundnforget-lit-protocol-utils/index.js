import * as LitJsSdk from "@lit-protocol/lit-node-client";
import {
    LitAbility,
    LitAccessControlConditionResource,
    createSiweMessage,
    generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { LIT_RPC, LitNetwork } from "@lit-protocol/constants";
import express from "express";
import * as ethers from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";



var app = express();


var evmContractConditions = [
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


const accessControlConditions = [
    {
        contractAddress: "",
        standardContractType: "",
        chain: "baseSepolia",
        method: "eth_getBalance",
        parameters: [],
        returnValueTest: {
            comparator: ">=",
            value: "1000000", // 0.000001 ETH
        },
    },
];


const privateKey = "b727f8581f6684a3f098c3650043d73c452dca51524aca3cfc29ca33149252d3";


const ethersSigner = new ethers.Wallet(
    privateKey,
    new JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);


class Lit {
    litNodeClient;
    chain;


    constructor(chain) {
        this.chain = chain;
    }


    async connect() {
        app.locals.litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
            alertWhenUnauthorized: false,
            litNetwork: "datil-dev",
            debug: true,
        });


        this.litNodeClient = app.locals.litNodeClient;
        await this.litNodeClient.connect();
    }


    async encrypt(message) {
        // Encrypt the message
        const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
            {
                evmContractConditions,
                dataToEncrypt: message,
            },
            this.litNodeClient
        );


        // Return the ciphertext and dataToEncryptHash
        return {
            ciphertext,
            dataToEncryptHash,
        };
    }


    async decrypt(ciphertext, dataToEncryptHash) {
        const sessionSigs = await litNodeClient.getSessionSigs({
            chain: "baseSepolia",
            expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
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
                    nonce: await litNodeClient.getLatestBlockhash(),
                    litNodeClient,
                });

                return await generateAuthSig({
                    signer: ethersSigner,
                    toSign,
                });
            },
        });
        console.log("sessionSignatures:: {}", sessionSigs);


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
    }
}


const chain = "baseSepolia";


let myLit = new Lit(chain);
await myLit.connect();


app.get("/encrypt", async function (req, res) {
    const input = req.params.input;
    const output = await myLit.encrypt(input).catch(e => console.log(e));
    res.send(JSON.stringify(output));
});

app.get("/decrypt", async function (req, res) {
    const ciphertext = req.params.ciphertext;
    const dataToEncryptHash = req.params.dataToEncryptHash;

    const output = await myLit.decrypt(ciphertext, dataToEncryptHash).catch(e => console.log(e));
    res.send(output);
});

app.get("/", async function (req, res) {
    let encryptString = await myLit.encrypt("Hello World").catch(e => console.log(e));
    console.log("encrypted=" + JSON.stringify(encryptString));
    const decryptedString = await myLit.decrypt(encryptString.ciphertext, encryptString.dataToEncryptHash);
    console.log("decrypted=" + decryptedString);
    
});


var server = app.listen(3000, function () {
    console.log("Express App running at http://127.0.0.1:3000/");
});



// url/encrypt?input=
// url/decrypt?ciphertext=&dataToEncryptHash=