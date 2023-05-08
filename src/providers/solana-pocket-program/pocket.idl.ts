export type Pocket = {
  version: '0.1.0';
  name: 'pocket';
  instructions: [
    {
      name: 'initialize';
      accounts: [
        {
          name: 'owner';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'pocketRegistry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'params';
          type: {
            defined: 'InitializePocketPlatformParams';
          };
        },
      ];
    },
    {
      name: 'updatePocketRegistry';
      accounts: [
        {
          name: 'owner';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'pocketRegistry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'params';
          type: {
            defined: 'UpdatePocketRegistryParams';
          };
        },
      ];
    },
    {
      name: 'createTokenVault';
      accounts: [
        {
          name: 'signer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'pocket';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'mintAccount';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'pocketTokenVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'createPocket';
      accounts: [
        {
          name: 'pocket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'signer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'params';
          type: {
            defined: 'CreatePocketParams';
          };
        },
      ];
    },
    {
      name: 'updatePocket';
      accounts: [
        {
          name: 'signer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'pocket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'params';
          type: {
            defined: 'UpdatePocketParams';
          };
        },
      ];
    },
    {
      name: 'deposit';
      accounts: [
        {
          name: 'signer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'signerBaseTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'signerQuoteTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pocket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pocketBaseTokenVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pocketQuoteTokenVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'params';
          type: {
            defined: 'DepositParams';
          };
        },
      ];
    },
    {
      name: 'withdraw';
      accounts: [
        {
          name: 'signer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'pocket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'signerBaseTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'signerQuoteTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pocketBaseTokenVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pocketQuoteTokenVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'closePocketAccounts';
      accounts: [
        {
          name: 'signer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'pocketBaseTokenVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pocketQuoteTokenVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pocket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'initSwapRegistry';
      accounts: [
        {
          name: 'pocket';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'openOrders';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketKey';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'dexProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'closeSwapRegistry';
      accounts: [
        {
          name: 'pocket';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'openOrders';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'destination';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketKey';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'dexProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'executeSwap';
      accounts: [
        {
          name: 'signer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'pocket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketKey';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pocketRegistry';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'pocketBaseTokenVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pocketQuoteTokenVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
  ];
  accounts: [
    {
      name: 'lookupTableRegistry';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'owner';
            type: 'publicKey';
          },
          {
            name: 'lookupTableAddresses';
            type: {
              vec: 'publicKey';
            };
          },
        ];
      };
    },
    {
      name: 'pocketPlatformRegistry';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'owner';
            type: 'publicKey';
          },
          {
            name: 'wasInitialized';
            type: 'bool';
          },
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'allowedMintAccounts';
            type: {
              vec: {
                defined: 'MintInfo';
              };
            };
          },
          {
            name: 'operators';
            type: {
              vec: 'publicKey';
            };
          },
        ];
      };
    },
    {
      name: 'pocket';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'id';
            type: 'string';
          },
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'owner';
            type: 'publicKey';
          },
          {
            name: 'name';
            type: 'string';
          },
          {
            name: 'status';
            type: {
              defined: 'PocketStatus';
            };
          },
          {
            name: 'baseTokenMintAddress';
            type: 'publicKey';
          },
          {
            name: 'quoteTokenMintAddress';
            type: 'publicKey';
          },
          {
            name: 'marketKey';
            type: 'publicKey';
          },
          {
            name: 'batchVolume';
            type: 'u64';
          },
          {
            name: 'startAt';
            type: 'u64';
          },
          {
            name: 'side';
            type: {
              defined: 'TradeSide';
            };
          },
          {
            name: 'buyCondition';
            type: {
              option: {
                defined: 'PriceCondition';
              };
            };
          },
          {
            name: 'stopConditions';
            type: {
              vec: {
                defined: 'StopCondition';
              };
            };
          },
          {
            name: 'frequency';
            type: {
              defined: 'DateDuration';
            };
          },
          {
            name: 'totalBaseDepositAmount';
            type: 'u64';
          },
          {
            name: 'totalQuoteDepositAmount';
            type: 'u64';
          },
          {
            name: 'baseTokenBalance';
            type: 'u64';
          },
          {
            name: 'quoteTokenBalance';
            type: 'u64';
          },
          {
            name: 'executedBatchAmount';
            type: 'u64';
          },
          {
            name: 'nextScheduledExecutionAt';
            type: 'u64';
          },
        ];
      };
    },
  ];
  types: [
    {
      name: 'CreatePocketParams';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'id';
            type: 'string';
          },
          {
            name: 'name';
            type: 'string';
          },
          {
            name: 'baseTokenAddress';
            type: 'publicKey';
          },
          {
            name: 'quoteTokenAddress';
            type: 'publicKey';
          },
          {
            name: 'marketKey';
            type: 'publicKey';
          },
          {
            name: 'batchVolume';
            type: 'u64';
          },
          {
            name: 'startAt';
            type: 'u64';
          },
          {
            name: 'buyCondition';
            type: {
              option: {
                defined: 'PriceCondition';
              };
            };
          },
          {
            name: 'stopConditions';
            type: {
              vec: {
                defined: 'StopCondition';
              };
            };
          },
          {
            name: 'frequency';
            type: {
              defined: 'DateDuration';
            };
          },
          {
            name: 'side';
            type: {
              defined: 'TradeSide';
            };
          },
        ];
      };
    },
    {
      name: 'DepositParams';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'mode';
            type: {
              defined: 'DepositedTokenType';
            };
          },
          {
            name: 'depositAmount';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'InitializePocketPlatformParams';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'operators';
            type: {
              vec: 'publicKey';
            };
          },
        ];
      };
    },
    {
      name: 'UpdatePocketRegistryParams';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'operators';
            type: {
              vec: 'publicKey';
            };
          },
        ];
      };
    },
    {
      name: 'UpdatePocketParams';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'status';
            type: {
              defined: 'PocketStatus';
            };
          },
        ];
      };
    },
    {
      name: 'ExchangeRate';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'rate';
            type: 'u64';
          },
          {
            name: 'fromDecimals';
            type: 'u8';
          },
          {
            name: 'quoteDecimals';
            type: 'u8';
          },
          {
            name: 'strict';
            type: 'bool';
          },
        ];
      };
    },
    {
      name: 'MintInfo';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'isEnabled';
            type: 'bool';
          },
          {
            name: 'mintAccount';
            type: 'publicKey';
          },
          {
            name: 'tokenAccount';
            type: 'publicKey';
          },
          {
            name: 'bump';
            type: 'u8';
          },
        ];
      };
    },
    {
      name: 'DateDuration';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'hours';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'DepositedTokenType';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Base';
          },
          {
            name: 'Quote';
          },
        ];
      };
    },
    {
      name: 'Side';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Bid';
          },
          {
            name: 'Ask';
          },
        ];
      };
    },
    {
      name: 'ErrorCode';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'SwapTokensCannotMatch';
          },
          {
            name: 'SlippageExceeded';
          },
          {
            name: 'ZeroSwap';
          },
        ];
      };
    },
    {
      name: 'PriceCondition';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Gt';
            fields: [
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'Gte';
            fields: [
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'Lt';
            fields: [
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'Lte';
            fields: [
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'Eq';
            fields: [
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'Neq';
            fields: [
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'Bw';
            fields: [
              {
                name: 'from_value';
                type: 'u64';
              },
              {
                name: 'to_value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'Nbw';
            fields: [
              {
                name: 'from_value';
                type: 'u64';
              },
              {
                name: 'to_value';
                type: 'u64';
              },
            ];
          },
        ];
      };
    },
    {
      name: 'StopCondition';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'EndTimeReach';
            fields: [
              {
                name: 'is_primary';
                type: 'bool';
              },
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'BaseTokenAmountReach';
            fields: [
              {
                name: 'is_primary';
                type: 'bool';
              },
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'QuoteTokenAmountReach';
            fields: [
              {
                name: 'is_primary';
                type: 'bool';
              },
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'SpentBaseTokenAmountReach';
            fields: [
              {
                name: 'is_primary';
                type: 'bool';
              },
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'SpentQuoteTokenAmountReach';
            fields: [
              {
                name: 'is_primary';
                type: 'bool';
              },
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'BatchAmountReach';
            fields: [
              {
                name: 'is_primary';
                type: 'bool';
              },
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
        ];
      };
    },
    {
      name: 'TradeSide';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Buy';
          },
          {
            name: 'Sell';
          },
        ];
      };
    },
    {
      name: 'PocketStatus';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Active';
          },
          {
            name: 'Paused';
          },
          {
            name: 'Closed';
          },
          {
            name: 'Withdrawn';
          },
        ];
      };
    },
  ];
  events: [
    {
      name: 'PocketConfigUpdated';
      fields: [
        {
          name: 'actor';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'operators';
          type: {
            vec: 'publicKey';
          };
          index: false;
        },
      ];
    },
    {
      name: 'VaultCreated';
      fields: [
        {
          name: 'actor';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'authority';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'mintAccount';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'associatedAccount';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'pocketAddress';
          type: 'publicKey';
          index: true;
        },
      ];
    },
    {
      name: 'PocketCreated';
      fields: [
        {
          name: 'owner';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'pocketAddress';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'name';
          type: 'string';
          index: false;
        },
      ];
    },
    {
      name: 'PocketUpdated';
      fields: [
        {
          name: 'actor';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'pocketAddress';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'status';
          type: {
            defined: 'PocketStatus';
          };
          index: false;
        },
        {
          name: 'memo';
          type: 'string';
          index: false;
        },
      ];
    },
    {
      name: 'PocketDeposited';
      fields: [
        {
          name: 'owner';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'pocketAddress';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'mintAddress';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'amount';
          type: 'u64';
          index: false;
        },
      ];
    },
    {
      name: 'PocketWithdrawn';
      fields: [
        {
          name: 'owner';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'pocketAddress';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'baseTokenMintAddress';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'baseTokenAmount';
          type: 'u64';
          index: false;
        },
        {
          name: 'quoteTokenMintAddress';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'quoteTokenAmount';
          type: 'u64';
          index: false;
        },
      ];
    },
    {
      name: 'DidSwap';
      fields: [
        {
          name: 'pocketAddress';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'givenAmount';
          type: 'u64';
          index: false;
        },
        {
          name: 'minExchangeRate';
          type: {
            defined: 'ExchangeRate';
          };
          index: false;
        },
        {
          name: 'fromAmount';
          type: 'u64';
          index: false;
        },
        {
          name: 'toAmount';
          type: 'u64';
          index: false;
        },
        {
          name: 'quoteAmount';
          type: 'u64';
          index: false;
        },
        {
          name: 'spillAmount';
          type: 'u64';
          index: false;
        },
        {
          name: 'fromMint';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'toMint';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'quoteMint';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'authority';
          type: 'publicKey';
          index: false;
        },
      ];
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'SystemError';
      msg: 'System error';
    },
    {
      code: 6001;
      name: 'AlreadyInitialized';
      msg: 'The program was already initialized';
    },
    {
      code: 6002;
      name: 'MintAccountExisted';
      msg: 'The mint account was existed';
    },
    {
      code: 6003;
      name: 'OnlyOperator';
      msg: 'Only Platform operator';
    },
    {
      code: 6004;
      name: 'OnlyAdministrator';
      msg: 'Only Platform Administrator';
    },
    {
      code: 6005;
      name: 'OnlyOwner';
      msg: 'Only Owner';
    },
    {
      code: 6006;
      name: 'NotReadyToSwap';
      msg: 'Not ready to pocket';
    },
  ];
};

export const IDL: Pocket = {
  version: '0.1.0',
  name: 'pocket',
  instructions: [
    {
      name: 'initialize',
      accounts: [
        {
          name: 'owner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'pocketRegistry',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'params',
          type: {
            defined: 'InitializePocketPlatformParams',
          },
        },
      ],
    },
    {
      name: 'updatePocketRegistry',
      accounts: [
        {
          name: 'owner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'pocketRegistry',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'params',
          type: {
            defined: 'UpdatePocketRegistryParams',
          },
        },
      ],
    },
    {
      name: 'createTokenVault',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'pocket',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'mintAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pocketTokenVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'createPocket',
      accounts: [
        {
          name: 'pocket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'params',
          type: {
            defined: 'CreatePocketParams',
          },
        },
      ],
    },
    {
      name: 'updatePocket',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'pocket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'params',
          type: {
            defined: 'UpdatePocketParams',
          },
        },
      ],
    },
    {
      name: 'deposit',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'signerBaseTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'signerQuoteTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pocket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pocketBaseTokenVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pocketQuoteTokenVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'params',
          type: {
            defined: 'DepositParams',
          },
        },
      ],
    },
    {
      name: 'withdraw',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'pocket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'signerBaseTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'signerQuoteTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pocketBaseTokenVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pocketQuoteTokenVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'closePocketAccounts',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'pocketBaseTokenVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pocketQuoteTokenVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pocket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'initSwapRegistry',
      accounts: [
        {
          name: 'pocket',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'openOrders',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketKey',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'dexProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'closeSwapRegistry',
      accounts: [
        {
          name: 'pocket',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'openOrders',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'destination',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketKey',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'dexProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'executeSwap',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'pocket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketKey',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pocketRegistry',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pocketBaseTokenVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pocketQuoteTokenVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'lookupTableRegistry',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'lookupTableAddresses',
            type: {
              vec: 'publicKey',
            },
          },
        ],
      },
    },
    {
      name: 'pocketPlatformRegistry',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'wasInitialized',
            type: 'bool',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'allowedMintAccounts',
            type: {
              vec: {
                defined: 'MintInfo',
              },
            },
          },
          {
            name: 'operators',
            type: {
              vec: 'publicKey',
            },
          },
        ],
      },
    },
    {
      name: 'pocket',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'id',
            type: 'string',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'status',
            type: {
              defined: 'PocketStatus',
            },
          },
          {
            name: 'baseTokenMintAddress',
            type: 'publicKey',
          },
          {
            name: 'quoteTokenMintAddress',
            type: 'publicKey',
          },
          {
            name: 'marketKey',
            type: 'publicKey',
          },
          {
            name: 'batchVolume',
            type: 'u64',
          },
          {
            name: 'startAt',
            type: 'u64',
          },
          {
            name: 'side',
            type: {
              defined: 'TradeSide',
            },
          },
          {
            name: 'buyCondition',
            type: {
              option: {
                defined: 'PriceCondition',
              },
            },
          },
          {
            name: 'stopConditions',
            type: {
              vec: {
                defined: 'StopCondition',
              },
            },
          },
          {
            name: 'frequency',
            type: {
              defined: 'DateDuration',
            },
          },
          {
            name: 'totalBaseDepositAmount',
            type: 'u64',
          },
          {
            name: 'totalQuoteDepositAmount',
            type: 'u64',
          },
          {
            name: 'baseTokenBalance',
            type: 'u64',
          },
          {
            name: 'quoteTokenBalance',
            type: 'u64',
          },
          {
            name: 'executedBatchAmount',
            type: 'u64',
          },
          {
            name: 'nextScheduledExecutionAt',
            type: 'u64',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'CreatePocketParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'id',
            type: 'string',
          },
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'baseTokenAddress',
            type: 'publicKey',
          },
          {
            name: 'quoteTokenAddress',
            type: 'publicKey',
          },
          {
            name: 'marketKey',
            type: 'publicKey',
          },
          {
            name: 'batchVolume',
            type: 'u64',
          },
          {
            name: 'startAt',
            type: 'u64',
          },
          {
            name: 'buyCondition',
            type: {
              option: {
                defined: 'PriceCondition',
              },
            },
          },
          {
            name: 'stopConditions',
            type: {
              vec: {
                defined: 'StopCondition',
              },
            },
          },
          {
            name: 'frequency',
            type: {
              defined: 'DateDuration',
            },
          },
          {
            name: 'side',
            type: {
              defined: 'TradeSide',
            },
          },
        ],
      },
    },
    {
      name: 'DepositParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'mode',
            type: {
              defined: 'DepositedTokenType',
            },
          },
          {
            name: 'depositAmount',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'InitializePocketPlatformParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'operators',
            type: {
              vec: 'publicKey',
            },
          },
        ],
      },
    },
    {
      name: 'UpdatePocketRegistryParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'operators',
            type: {
              vec: 'publicKey',
            },
          },
        ],
      },
    },
    {
      name: 'UpdatePocketParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'status',
            type: {
              defined: 'PocketStatus',
            },
          },
        ],
      },
    },
    {
      name: 'ExchangeRate',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'rate',
            type: 'u64',
          },
          {
            name: 'fromDecimals',
            type: 'u8',
          },
          {
            name: 'quoteDecimals',
            type: 'u8',
          },
          {
            name: 'strict',
            type: 'bool',
          },
        ],
      },
    },
    {
      name: 'MintInfo',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'isEnabled',
            type: 'bool',
          },
          {
            name: 'mintAccount',
            type: 'publicKey',
          },
          {
            name: 'tokenAccount',
            type: 'publicKey',
          },
          {
            name: 'bump',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'DateDuration',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'hours',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'DepositedTokenType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Base',
          },
          {
            name: 'Quote',
          },
        ],
      },
    },
    {
      name: 'Side',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Bid',
          },
          {
            name: 'Ask',
          },
        ],
      },
    },
    {
      name: 'ErrorCode',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'SwapTokensCannotMatch',
          },
          {
            name: 'SlippageExceeded',
          },
          {
            name: 'ZeroSwap',
          },
        ],
      },
    },
    {
      name: 'PriceCondition',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Gt',
            fields: [
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'Gte',
            fields: [
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'Lt',
            fields: [
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'Lte',
            fields: [
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'Eq',
            fields: [
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'Neq',
            fields: [
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'Bw',
            fields: [
              {
                name: 'from_value',
                type: 'u64',
              },
              {
                name: 'to_value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'Nbw',
            fields: [
              {
                name: 'from_value',
                type: 'u64',
              },
              {
                name: 'to_value',
                type: 'u64',
              },
            ],
          },
        ],
      },
    },
    {
      name: 'StopCondition',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'EndTimeReach',
            fields: [
              {
                name: 'is_primary',
                type: 'bool',
              },
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'BaseTokenAmountReach',
            fields: [
              {
                name: 'is_primary',
                type: 'bool',
              },
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'QuoteTokenAmountReach',
            fields: [
              {
                name: 'is_primary',
                type: 'bool',
              },
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'SpentBaseTokenAmountReach',
            fields: [
              {
                name: 'is_primary',
                type: 'bool',
              },
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'SpentQuoteTokenAmountReach',
            fields: [
              {
                name: 'is_primary',
                type: 'bool',
              },
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'BatchAmountReach',
            fields: [
              {
                name: 'is_primary',
                type: 'bool',
              },
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
        ],
      },
    },
    {
      name: 'TradeSide',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Buy',
          },
          {
            name: 'Sell',
          },
        ],
      },
    },
    {
      name: 'PocketStatus',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Active',
          },
          {
            name: 'Paused',
          },
          {
            name: 'Closed',
          },
          {
            name: 'Withdrawn',
          },
        ],
      },
    },
  ],
  events: [
    {
      name: 'PocketConfigUpdated',
      fields: [
        {
          name: 'actor',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'operators',
          type: {
            vec: 'publicKey',
          },
          index: false,
        },
      ],
    },
    {
      name: 'VaultCreated',
      fields: [
        {
          name: 'actor',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'authority',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'mintAccount',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'associatedAccount',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'pocketAddress',
          type: 'publicKey',
          index: true,
        },
      ],
    },
    {
      name: 'PocketCreated',
      fields: [
        {
          name: 'owner',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'pocketAddress',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'name',
          type: 'string',
          index: false,
        },
      ],
    },
    {
      name: 'PocketUpdated',
      fields: [
        {
          name: 'actor',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'pocketAddress',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'status',
          type: {
            defined: 'PocketStatus',
          },
          index: false,
        },
        {
          name: 'memo',
          type: 'string',
          index: false,
        },
      ],
    },
    {
      name: 'PocketDeposited',
      fields: [
        {
          name: 'owner',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'pocketAddress',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'mintAddress',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'amount',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'PocketWithdrawn',
      fields: [
        {
          name: 'owner',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'pocketAddress',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'baseTokenMintAddress',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'baseTokenAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'quoteTokenMintAddress',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'quoteTokenAmount',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'DidSwap',
      fields: [
        {
          name: 'pocketAddress',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'givenAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'minExchangeRate',
          type: {
            defined: 'ExchangeRate',
          },
          index: false,
        },
        {
          name: 'fromAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'toAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'quoteAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'spillAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'fromMint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'toMint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'quoteMint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'SystemError',
      msg: 'System error',
    },
    {
      code: 6001,
      name: 'AlreadyInitialized',
      msg: 'The program was already initialized',
    },
    {
      code: 6002,
      name: 'MintAccountExisted',
      msg: 'The mint account was existed',
    },
    {
      code: 6003,
      name: 'OnlyOperator',
      msg: 'Only Platform operator',
    },
    {
      code: 6004,
      name: 'OnlyAdministrator',
      msg: 'Only Platform Administrator',
    },
    {
      code: 6005,
      name: 'OnlyOwner',
      msg: 'Only Owner',
    },
    {
      code: 6006,
      name: 'NotReadyToSwap',
      msg: 'Not ready to pocket',
    },
  ],
};
