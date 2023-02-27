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
          name: 'pocketRegistry';
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
          name: 'signerTokenAccount';
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
          name: 'signerTargetTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pocketBaseTokenVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pocketTargetTokenVault';
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
      name: 'initializePocketDexRegistry';
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
          name: 'pocketRegistry';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'openOrders';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'dexProgram';
          isMut: false;
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
          name: 'pocketTargetTokenVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'coinVault';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'pcVault';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'requestQueue';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'eventQueue';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'marketBids';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'marketAsks';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'openOrders';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'dexProgram';
          isMut: false;
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
            name: 'targetTokenMintAddress';
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
                defined: 'BuyCondition';
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
            name: 'totalDepositAmount';
            type: 'u64';
          },
          {
            name: 'baseTokenBalance';
            type: 'u64';
          },
          {
            name: 'targetTokenBalance';
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
            name: 'targetTokenAddress';
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
                defined: 'BuyCondition';
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
      name: 'BuyCondition';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'tokenAddress';
            type: 'publicKey';
          },
          {
            name: 'condition';
            type: {
              defined: 'PriceCondition';
            };
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
      name: 'PriceCondition';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'GT';
            fields: [
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'GTE';
            fields: [
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'LT';
            fields: [
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'LTE';
            fields: [
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'EQ';
            fields: [
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'NEQ';
            fields: [
              {
                name: 'value';
                type: 'u64';
              },
            ];
          },
          {
            name: 'BW';
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
            name: 'NBW';
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
            name: 'TargetTokenAmountReach';
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
      name: 'MainProgressBy';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'EndTimeReach';
          },
          {
            name: 'BaseTokenAmountReach';
          },
          {
            name: 'TargetTokenAmountReach';
          },
          {
            name: 'BatchAmountReach';
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
          name: 'status';
          type: {
            defined: 'PocketStatus';
          };
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
          name: 'targetTokenMintAddress';
          type: 'publicKey';
          index: true;
        },
        {
          name: 'targetTokenAmount';
          type: 'u64';
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
      msg: 'Not ready to swap';
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
          name: 'pocketRegistry',
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
          name: 'signerTokenAccount',
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
          name: 'signerTargetTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pocketBaseTokenVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pocketTargetTokenVault',
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
      name: 'initializePocketDexRegistry',
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
          name: 'pocketRegistry',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'openOrders',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'dexProgram',
          isMut: false,
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
          name: 'pocketTargetTokenVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'coinVault',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pcVault',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'requestQueue',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'eventQueue',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'marketBids',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'marketAsks',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'openOrders',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'dexProgram',
          isMut: false,
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
            name: 'targetTokenMintAddress',
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
                defined: 'BuyCondition',
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
            name: 'totalDepositAmount',
            type: 'u64',
          },
          {
            name: 'baseTokenBalance',
            type: 'u64',
          },
          {
            name: 'targetTokenBalance',
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
            name: 'targetTokenAddress',
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
                defined: 'BuyCondition',
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
      name: 'BuyCondition',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'tokenAddress',
            type: 'publicKey',
          },
          {
            name: 'condition',
            type: {
              defined: 'PriceCondition',
            },
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
      name: 'PriceCondition',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'GT',
            fields: [
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'GTE',
            fields: [
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'LT',
            fields: [
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'LTE',
            fields: [
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'EQ',
            fields: [
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'NEQ',
            fields: [
              {
                name: 'value',
                type: 'u64',
              },
            ],
          },
          {
            name: 'BW',
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
            name: 'NBW',
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
            name: 'TargetTokenAmountReach',
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
      name: 'MainProgressBy',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'EndTimeReach',
          },
          {
            name: 'BaseTokenAmountReach',
          },
          {
            name: 'TargetTokenAmountReach',
          },
          {
            name: 'BatchAmountReach',
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
          name: 'status',
          type: {
            defined: 'PocketStatus',
          },
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
          name: 'targetTokenMintAddress',
          type: 'publicKey',
          index: true,
        },
        {
          name: 'targetTokenAmount',
          type: 'u64',
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
      msg: 'Not ready to swap',
    },
  ],
};
