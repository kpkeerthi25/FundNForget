// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

import {ISP} from "sign-protocol-evm/interfaces/ISP.sol";
import {ISPHook} from "sign-protocol-evm/interfaces/ISPHook.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Attestation } from "sign-protocol-evm/models/Attestation.sol";

interface IFundNForget {
    function upsertFundManagerStrategyAttestationMapping(
        address fundMangerAddress,
        uint64 latestStrategyAttestationId
    ) external;
}


contract FundNForgetSignProtocolHook is ISPHook {
    IFundNForget fundNForget;
    error UnsupportedOperation();
    event HookEvent(address indexed _from);
    event Log(address, uint64);

    constructor(address fnfAddress) {
        fundNForget = IFundNForget(fnfAddress);
    }

    function didReceiveAttestation(
        address attester,
        uint64, // schemaId
        uint64 attestationId,
        bytes calldata // extraData
    )
        external
        payable
    {
        // Attestation memory attestation = ISP(msg.sender).getAttestation(attestationId);
        // string memory value = abi.decode(attestation.data, (string));
        // emit Log(attestationId);
        emit Log(attester, attestationId);
        fundNForget.upsertFundManagerStrategyAttestationMapping(attester, attestationId);
    }

    function didReceiveAttestation(
        address attester,
        uint64, // schemaId
        uint64, // attestationId
        IERC20, // resolverFeeERC20Token
        uint256, // resolverFeeERC20Amount
        bytes calldata // extraData
    )
        external
        view
    {
        revert UnsupportedOperation();
    }

    function didReceiveRevocation(
        address attester,
        uint64, // schemaId
        uint64, // attestationId
        bytes calldata // extraData
    )
        external
        payable
    {
        revert UnsupportedOperation();
    }

    function didReceiveRevocation(
        address attester,
        uint64, // schemaId
        uint64, // attestationId
        IERC20, // resolverFeeERC20Token
        uint256, // resolverFeeERC20Amount
        bytes calldata // extraData
    )
        external
        view
    {
        revert UnsupportedOperation();
    }
}