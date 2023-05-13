/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  PocketVault,
  PocketVaultInterface,
} from "../../../contracts/PocketVault.sol/PocketVault";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "pocketId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "baseTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "baseTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "targetTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "targetTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "ClosedPosition",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "pocketId",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "Deposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "ethermanAddress",
        type: "address",
      },
    ],
    name: "EthermanUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "permit2",
        type: "address",
      },
    ],
    name: "Permit2Updated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "quoter",
        type: "address",
      },
    ],
    name: "QuoterUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "registry",
        type: "address",
      },
    ],
    name: "RegistryUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "SwapFeeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "pocketId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "baseTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "baseTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "targetTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "targetTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "Swapped",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "actor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "pocketId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "baseTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "baseTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "targetTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "targetTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "Withdrawn",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "pocketId",
        type: "string",
      },
    ],
    name: "closePosition",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "actor",
            type: "address",
          },
          {
            internalType: "string",
            name: "id",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
        ],
        internalType: "struct Params.UpdatePocketDepositParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "etherman",
    outputs: [
      {
        internalType: "contract Etherman",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "baseTokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "targetTokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "getCurrentQuote",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initEtherman",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "pocketId",
        type: "string",
      },
    ],
    name: "makeDCASwap",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "permit2",
    outputs: [
      {
        internalType: "contract IPermit2",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "quoter",
    outputs: [
      {
        internalType: "contract IQuoter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "registry",
    outputs: [
      {
        internalType: "contract PocketRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "ethermanAddress",
        type: "address",
      },
    ],
    name: "setEtherman",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "permit2Address",
        type: "address",
      },
    ],
    name: "setPermit2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "quoterAddress",
        type: "address",
      },
    ],
    name: "setQuoter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "registryAddress",
        type: "address",
      },
    ],
    name: "setRegistry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "setSwapFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "swapFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "actor",
            type: "address",
          },
          {
            internalType: "string",
            name: "id",
            type: "string",
          },
        ],
        internalType: "struct Params.UpdatePocketWithdrawalParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x608080604052346100c1576000549060ff8260081c1661006f575060ff80821610610034575b6040516125f090816100c78239f35b60ff90811916176000557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160ff8152a138610025565b62461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b6064820152608490fd5b600080fdfe608060409080825260049182361015610023575b505050361561002157600080fd5b005b600091823560e01c90816307d5ab8e1461176257508063101ec30a146116fd57806312261ee7146116d657806334e19907146116885780633f4ba83a146115e957806354cf2aeb146115cb5780635c975abb146115a857806361a45ae614610e775780636afd431a14610ca7578063715018a614610c4b5780637b10399914610c245780638129fc1c14610aaa5780638456cb5914610a095780638b6a70c4146107ec5780638da5cb5b146107c55780639c89bb3d14610538578063a91ee0dc146104d3578063c6bbd5a7146104ac578063d2aad5f114610356578063f1ef539a146102ef578063f2fde38b14610242578063f912c64b146101da5763ff2aaf3e0361001357346101d657816003193601126101d6576101416117e7565b80516104f68082019082821067ffffffffffffffff8311176101c3579082916120c58339039083f080156101b8576001600160a01b039150168160cd54826001600160a01b031982161760cd551617337f0439c661e410390da47baf9dde489a2872615b9f9c556175267481f36e328fb48380a380f35b5051903d90823e3d90fd5b602485604188634e487b7160e01b835252fd5b5080fd5b823461023f57602036600319011261023f576001600160a01b036101fc611787565b6102046117e7565b16806001600160a01b031960cb54161760cb55337ff7248061c47e1cf157db85f3c9bac5cb0007cbb8867be0807f6dcdb7eb8f52688380a380f35b80fd5b5082346102eb5760203660031901126102eb5761025d611787565b916102666117e7565b6001600160a01b03831615610282578361027f8461183f565b80f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152fd5b8280fd5b8284346101d65760203660031901126101d657356001600160a01b0381168091036101d65761031c6117e7565b806001600160a01b031960cd54161760cd55337f0439c661e410390da47baf9dde489a2872615b9f9c556175267481f36e328fb48380a380f35b5091903461023f57608036600319011261023f57610372611787565b602435906001600160a01b039081831683036104955761044b9160443595878681519361040d856103ff60209a8b9962ffffff60643516908b850191927fffffff0000000000000000000000000000000000000000000000000000000000602b946bffffffffffffffffffffffff19809460601b16855260e81b16601484015260601b1660178201520190565b03601f1981018752866118cd565b60cb5416928251968795869485937fcdca175300000000000000000000000000000000000000000000000000000000855284015260448301906118ef565b8a602483015203925af19283156104a1579261046d575b508351928352820152f35b9080925081813d831161049a575b61048581836118cd565b8101031261049557519038610462565b600080fd5b503d61047b565b8551903d90823e3d90fd5b50346101d657816003193601126101d6576020906001600160a01b0360cb54169051908152f35b823461023f57602036600319011261023f576001600160a01b036104f5611787565b6104fd6117e7565b16806001600160a01b031960c954161760c955337f482b97c53e48ffa324a976e2738053e9aff6eee04d8aac63b10e19411d869b828380a380f35b5091903461023f576105493661179d565b6001600160a01b0360c95416855192632483e71560e01b845260209384818881865afa801561078c5785908790610796575b8951632474521560e21b81528981019182523360208301529250829081906040015b0381865afa90811561078c57906105bb91879161075f575b50611947565b6105ca600260655414156119b8565b6002606555865163381635c960e21b815284878201526101c0968782806105f5602482018988611b14565b0381875afa938415610755579089918893899a8a9761070f575b5050908291889351938492639888b5ab60e01b84528301528180610637602482018b8a611b14565b03915afa96871561070457966106a1575b509561068f839261067d88847fb194e0ef323d92c92731da0692fef530ee4d3105579af6ae8489773b7bfd25b497829c611b99565b9788948b519586953399429588611b35565b0390a260016065558351928352820152f35b8396507fb194e0ef323d92c92731da0692fef530ee4d3105579af6ae8489773b7bfd25b4939261067d89936106ee61068f948d803d106106fd575b6106e681836118cd565b810190611fab565b90509950935050929350610648565b503d6106dc565b8951903d90823e3d90fd5b89949b508091929750610738939550903d1061074e575b61073081836118cd565b810190611a5a565b505050505050509991939099959091923861060f565b503d610726565b89513d89823e3d90fd5b61077f9150863d8811610785575b61077781836118cd565b81019061192f565b386105b5565b503d61076d565b88513d88823e3d90fd5b5081813d83116107be575b6107ab81836118cd565b81010312610495578461059d915161057b565b503d6107a1565b50346101d657816003193601126101d6576020906001600160a01b03609754169051908152f35b5082346102eb57602090600319908282360112610a015780359167ffffffffffffffff8311610a05576080908336030112610a01576001600160a01b03918260c954168551632483e71560e01b815285818581855afa80156109f757869189916109c6575b508751632474521560e21b8152858101918252336020830152928391829081906040015b03915afa80156109bc5761088f91889161099f5750611947565b61089e600260655414156119b8565b60026065556064810191836108b28461203f565b1691878660448301359460648a51809481937f23b872dd00000000000000000000000000000000000000000000000000000000835233898401523060248401528960448401525af19089821561070457937f8b5e56b33d13f92f8ccbdeef17b16bf5dbbcd3a6b98f58057f8c5c6301af18d3979695936109446109699461094f946109579d9891610982575b50611ff4565b602481019101611fc1565b98909461203f565b9383519860608a5260608a0191611b14565b95870152429086015216928033930390a3600160655580f35b61099991508c8d3d106107855761077781836118cd565b8e61093e565b6109b69150863d88116107855761077781836118cd565b886105b5565b86513d89823e3d90fd5b82819392503d83116109f0575b6109dd81836118cd565b8101031261049557518590610875610851565b503d6109d3565b87513d8a823e3d90fd5b8480fd5b8580fd5b5082346102eb57826003193601126102eb57610a236117e7565b6033549060ff8216610a67575060ff1916600117603355513381527f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25890602090a180f35b606490602084519162461bcd60e51b8352820152601060248201527f5061757361626c653a20706175736564000000000000000000000000000000006044820152fd5b5082346102eb57826003193601126102eb57825460ff8160081c161591828093610c17575b8015610c00575b15610b97575060ff198082166001178555610b229183610b86575b5060ff855460081c1690610b0482612053565b610b0d82612053565b60335416603355610b1d81612053565b612053565b610b2b3361183f565b825490610b4160ff8360081c16610b1d81612053565b6001606555610b4e578280f35b61ff001916825551600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249890602090a181808280f35b61ffff191661010117855585610af1565b608490602085519162461bcd60e51b8352820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a65640000000000000000000000000000000000006064820152fd5b50303b158015610ad65750600160ff831614610ad6565b50600160ff831610610acf565b50346101d657816003193601126101d6576020906001600160a01b0360c954169051908152f35b823461023f578060031936011261023f57610c646117e7565b60006001600160a01b036097546001600160a01b03198116609755167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b5082346102eb57610cb73661179d565b6001600160a01b0360c9959295541692845195632483e71560e01b875260209485888481845afa978815610e21578598610e48575b508651632474521560e21b81528381019889523360208a0152978690899081906040010381845afa978815610e2157869798610d309187989791610e2b5750611947565b610d3f600260655414156119b8565b6002606555875196879363381635c960e21b85528401526101c09283918180610d6c602482018988611b14565b03915afa958615610e2157859086938798610dc8575b50509161068f8792610db78489857f571b5d97d5e5253e7e627b3d73eb2d9e59aaa0c36a26d2b8ef077fdbe36a720f98611b99565b80988b519586953399429588611b35565b610db793985061068f97507f571b5d97d5e5253e7e627b3d73eb2d9e59aaa0c36a26d2b8ef077fdbe36a720f9450610e0c9250803d1061074e5761073081836118cd565b50939d959c9699959850610d82945050505050565b87513d87823e3d90fd5b610e429150873d89116107855761077781836118cd565b8a6105b5565b97508588813d8311610e70575b610e5f81836118cd565b810103126104955796519685610cec565b503d610e55565b5082346102eb57602091600319908382360112610a015782359067ffffffffffffffff8211610a055780828501938336030112610a05576001600160a01b03918260c95416908251632483e71560e01b815287818881865afa801561156b5788908a90611575575b8551632474521560e21b81528981019182523360208301529250829081906040015b0381865afa90811561156b5760249291610f21918b9161154e5750611947565b610f30600260655414156119b8565b600260655501610f408186611fc1565b96909484519763381635c960e21b895289838a01528880610f6a6101c0998a946024840191611b14565b0381875afa978815611544578a968b99611514575b505086979885610f9285610fb29a611fc1565b82519a8b928392639888b5ab60e01b845286898501526024840191611b14565b0381885afa94851561150a578b988c966114de575b50908061101592610fd8878d611fc1565b8a929192518096819482937fbef48ddf000000000000000000000000000000000000000000000000000000008452878c8501526024840191611b14565b03915afa9182156114d4578c92611499575b508260cb541687518d838288817f4aa4a4fc00000000000000000000000000000000000000000000000000000000968782525afa91821561148d5781878d8f9594938e949561144b575b508116931683036113c557916110ba939186938a8a60cd541692519687958694859363095ea7b360e01b85528401602090939291936001600160a01b0360408201951681520152565b03925af1801561139c576113a8575b508360cd54168d813b1561023f57895163e16d9ce560e01b81528088018d81526001600160a01b038789161660208201529092839182908490829060400103925af1801561139c57611381575b50908c949392915b818460cb541691868b518094819382525afa908115611282578d85918893611346575b5081169116810361128c578188611188928660cd5416898d5180968195829463095ea7b360e01b84528d8401602090939291936001600160a01b0360408201951681520152565b03925af1801561128257611264575b50508160cd5416803b15610a015784928388936111df8b519788968795869463e16d9ce560e01b8652169184019092916001600160a01b036020916040840195845216910152565b03925af1801561125a5761123c575b50509061122061123193927f31d8533831066fbfeab87d0909f9e75d882c7551ba897456efad73b35c80419a97611fc1565b979092519586953399429588611b35565b0390a2600160655580f35b6112499094939294611887565b61125657909187896111ee565b8780fd5b85513d84823e3d90fd5b8161127a92903d106107855761077781836118cd565b508c80611197565b89513d88823e3d90fd5b90948593509187989c9b9697926112cd958e519687958694859363a9059cbb60e01b85528401602090939291936001600160a01b0360408201951681520152565b03925af1918a831561133b57611220937f31d8533831066fbfeab87d0909f9e75d882c7551ba897456efad73b35c80419a9a9b9693611231989693611319939261131e575b5050611ff4565b611fc1565b6113349250803d106107855761077781836118cd565b8d80611312565b8a51903d90823e3d90fd5b925050508181813d831161137a575b61135f81836118cd565b81010312610a055783806113738f93611a03565b9290611141565b503d611355565b611391909d91959493929d611887565b9b909192938d611116565b8e8a51903d90823e3d90fd5b6113be90833d85116107855761077781836118cd565b508d6110c9565b97969594939261140392868a8a8895519687958694859363a9059cbb60e01b85528401602090939291936001600160a01b0360408201951681520152565b03925af1908115611441579061141f9188916114245750611ff4565b61111e565b61143b9150843d86116107855761077781836118cd565b3861093e565b8a513d89823e3d90fd5b955050509150508382813d8311611486575b61146781836118cd565b8101031261023f57898b9187808f9561147f90611a03565b9490611071565b503d61145d565b508951903d90823e3d90fd5b9080925081813d83116114cd575b6114b181836118cd565b810103126114c9576114c290611a03565b908c611027565b8b80fd5b503d6114a7565b87513d8e823e3d90fd5b829950611015929196506114fe90883d8a116106fd576106e681836118cd565b99909996919250610fc7565b86513d8d823e3d90fd5b610fb2989950611531929750803d1061074e5761073081836118cd565b505050505050509691509597968b610f7f565b85513d8c823e3d90fd5b61156591508a3d8c116107855761077781836118cd565b8b6105b5565b84513d8b823e3d90fd5b5081813d83116115a1575b61158a81836118cd565b8101031261159d5787610f019151610edf565b8880fd5b503d611580565b50346101d657816003193601126101d65760209060ff6033541690519015158152f35b50346101d657816003193601126101d65760209060cc549051908152f35b5082346102eb57826003193601126102eb576116036117e7565b6033549060ff821615611645575060ff1916603355513381527f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa90602090a180f35b606490602084519162461bcd60e51b8352820152601460248201527f5061757361626c653a206e6f74207061757365640000000000000000000000006044820152fd5b5082346102eb5760203660031901126102eb5735906116a56117e7565b8160cc55519081527fd62f14de25e4b3623187ccc4b5339643c2df328389401df4af8b3b613286725760203392a280f35b50346101d657816003193601126101d6576020906001600160a01b0360ca54169051908152f35b823461023f57602036600319011261023f576001600160a01b0361171f611787565b6117276117e7565b16806001600160a01b031960ca54161760ca55337f458609883bfc2c0eb1300d68839f0a6aa0b7a1997aba004773946caf044a06ff8380a380f35b8390346101d657816003193601126101d6576020906001600160a01b0360cd54168152f35b600435906001600160a01b038216820361049557565b9060206003198301126104955760043567ffffffffffffffff9283821161049557806023830112156104955781600401359384116104955760248483010111610495576024019190565b6001600160a01b036097541633036117fb57565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b609754906001600160a01b0380911691826001600160a01b0319821617609755167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3565b67ffffffffffffffff811161189b57604052565b634e487b7160e01b600052604160045260246000fd5b6040810190811067ffffffffffffffff82111761189b57604052565b90601f8019910116810190811067ffffffffffffffff82111761189b57604052565b919082519283825260005b84811061191b575050826000602080949584010152601f8019910116010190565b6020818301810151848301820152016118fa565b90816020910312610495575180151581036104955790565b1561194e57565b608460405162461bcd60e51b815260206004820152602560248201527f5065726d697373696f6e3a206f6e6c792072656c61796572206973207065726d60448201527f69747465640000000000000000000000000000000000000000000000000000006064820152fd5b156119bf57565b606460405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152fd5b51906001600160a01b038216820361049557565b9190826040910312610495576040516040810181811067ffffffffffffffff82111761189b57604052809280516004811015610495578252602090810151910152565b9190828103906101c0821261049557611a7284611a03565b93611a7f60208201611a03565b93611a8c60408301611a03565b9360608301519360808401519360a081015193606060c08301519460df190112610495576040516060810181811067ffffffffffffffff82111761189b5760405260e08301518152610100830151602082015261012083015190600782101561049557611b1191604082015293610180611b0a826101408701611a17565b9401611a17565b90565b908060209392818452848401376000828201840152601f01601f1916010190565b93979695929160a09591611b519160c0875260c0870191611b14565b976001600160a01b038093166020860152604085015216606083015260808201520152565b805115611b835760200190565b634e487b7160e01b600052603260045260246000fd5b60ca546040805163095ea7b360e01b81526001600160a01b0392831660048083019190915260248201889052919660009692959094909360209392858216929085816044818d885af18015611fa157611f84575b508160ca541692833b15611f8057899060848a83868f5196879586947f87517c450000000000000000000000000000000000000000000000000000000086528501521697886024840152878d16604484015265ffffffffffff421660648401525af18015611f7657611f63575b50908792918951928486850152600197888552611c76856118b1565b8b805198611c838a6118b1565b8a8a5288885b818110611f4d5750611d499291611d3791611cff8762ffffff60cc54168651948594850191927fffffff0000000000000000000000000000000000000000000000000000000000602b946bffffffffffffffffffffffff19809460601b16855260e81b16601484015260601b1660178201520190565b0399611d13601f199b8c81018452836118cd565b83519586948d3090870152850152606084015260a0608084015260c08301906118ef565b8b60a0830152038781018352826118cd565b611d5288611b76565b52611d5c87611b76565b5016948951967f70a082310000000000000000000000000000000000000000000000000000000094858952308a8a015286896024818b5afa988915611f43578b99611f14575b50833b15611f10579189928b9492611dea8e9788519889977f24856bc300000000000000000000000000000000000000000000000000000000895288015260448701906118ef565b6003198682030160248701528351908181528a81018b808460051b84010196019489925b8d858510611ed75750505050505050508383809203925af18015611ecd578392918891611eb4575b50506024885180958193825230898301525afa958615611eab57508495611e7b575b50508303928311611e6857505090565b906011602492634e487b7160e01b835252fd5b9080929550813d8311611ea4575b611e9381836118cd565b810103126104955751923880611e58565b503d611e89565b513d86823e3d90fd5b611ec091929350611887565b610a055781908638611e36565b88513d89823e3d90fd5b91949786999b508194979a5080868493611ef993999699030188528b516118ef565b99019401940190938f98969394928a989693611e0e565b8a80fd5b9098508681813d8311611f3c575b611f2c81836118cd565b8101031261049557519738611da2565b503d611f22565b8c513d8d823e3d90fd5b60608c82018301528e99508f93508a9101611c89565b611f6f90989198611887565b9638611c5a565b8a513d8b823e3d90fd5b8980fd5b611f9a90863d88116107855761077781836118cd565b5038611bed565b8b513d8c823e3d90fd5b9190826040910312610495576020825192015190565b903590601e1981360301821215610495570180359067ffffffffffffffff82116104955760200191813603831361049557565b15611ffb57565b606460405162461bcd60e51b815260206004820152601c60248201527f4572726f723a2063616e6e6f74207472616e7366657220746f6b656e000000006044820152fd5b356001600160a01b03811681036104955790565b1561205a57565b608460405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e670000000000000000000000000000000000000000006064820152fdfe6080806040523461005b5760008054336001600160a01b0319821681178355916001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09080a361049590816100618239f35b600080fdfe60406080815260048036101561001f575b5050361561001d57600080fd5b005b600091823560e01c8063715018a6146103665780638da5cb5b14610340578063e16d9ce5146101495763f2fde38b146100585750610010565b34610145576020366003190112610145578135916001600160a01b0391828416809403610141576100876103cf565b83156100d85750506000548273ffffffffffffffffffffffffffffffffffffffff19821617600055167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a380f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152fd5b8480fd5b8280fd5b503461014557806003193601126101455781356024918235916001600160a01b03831680930361033c5761017b6103cf565b8151927f23b872dd000000000000000000000000000000000000000000000000000000008452338685015230858501528160448501528660209473bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c90868160648186865af18015610332576102ff575b50803b156102fb578190878651809481937f2e1a7d4d000000000000000000000000000000000000000000000000000000008352888d8401525af180156102f1576102c2575b508680809381935af13d156102bd573d67ffffffffffffffff81116102ab5782519061025a601f8201601f1916860183610427565b815286843d92013e5b1561026c578480f35b5162461bcd60e51b8152928301526019908201527f4572726f723a2063616e6e6f7420756e777261702057455448000000000000006044820152606490fd5b8487604188634e487b7160e01b835252fd5b610263565b67ffffffffffffffff8198929398116102df578352959038610225565b8582604189634e487b7160e01b835252fd5b84513d8a823e3d90fd5b5080fd5b8681813d831161032b575b6103148183610427565b810103126101455751801515036102fb57386101df565b503d61030a565b86513d85823e3d90fd5b8580fd5b8382346102fb57816003193601126102fb576001600160a01b0360209254169051908152f35b83346103cc57806003193601126103cc5761037f6103cf565b806001600160a01b03815473ffffffffffffffffffffffffffffffffffffffff1981168355167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b80fd5b6001600160a01b036000541633036103e357565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b90601f8019910116810190811067ffffffffffffffff82111761044957604052565b634e487b7160e01b600052604160045260246000fdfea2646970667358221220c6bf0bc1aa4c8885dc95faeacc3ac72274f09e71f5dc506f9d9a4f2930e8765b64736f6c63430008130033a2646970667358221220db2e347966cecbc13ede0e31a8fffb4c4bfb5b98e5b3a2631d3afe585102cd6964736f6c63430008130033";

type PocketVaultConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PocketVaultConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PocketVault__factory extends ContractFactory {
  constructor(...args: PocketVaultConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<PocketVault> {
    return super.deploy(overrides || {}) as Promise<PocketVault>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): PocketVault {
    return super.attach(address) as PocketVault;
  }
  override connect(signer: Signer): PocketVault__factory {
    return super.connect(signer) as PocketVault__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PocketVaultInterface {
    return new utils.Interface(_abi) as PocketVaultInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PocketVault {
    return new Contract(address, _abi, signerOrProvider) as PocketVault;
  }
}
