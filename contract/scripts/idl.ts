export type RpsGame = {
  "version": "0.1.0",
  "name": "rps_game",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setInfo",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "winPercentage",
          "type": {
            "array": [
              "u16",
              3
            ]
          }
        },
        {
          "name": "rewardPolicyByClass",
          "type": {
            "array": [
              "u16",
              3
            ]
          }
        }
      ]
    },
    {
      "name": "coinflip",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pythAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "betAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "betSol",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pythAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "betAmount",
          "type": "u64"
        },
        {
          "name": "check",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositReward",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "depositAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawAll",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "globalState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "winPercentage",
            "type": {
              "array": [
                "u16",
                3
              ]
            }
          },
          {
            "name": "rewardPolicyByClass",
            "type": {
              "array": [
                "u16",
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "userState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          },
          {
            "name": "lastSpinresult",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAdmin",
      "msg": "Invalid admin"
    }
  ]
};

export const IDL: RpsGame = {
  "version": "0.1.0",
  "name": "rps_game",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setInfo",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "winPercentage",
          "type": {
            "array": [
              "u16",
              3
            ]
          }
        },
        {
          "name": "rewardPolicyByClass",
          "type": {
            "array": [
              "u16",
              3
            ]
          }
        }
      ]
    },
    {
      "name": "coinflip",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pythAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "betAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "betSol",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pythAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "betAmount",
          "type": "u64"
        },
        {
          "name": "check",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositReward",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "depositAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawAll",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "globalState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "winPercentage",
            "type": {
              "array": [
                "u16",
                3
              ]
            }
          },
          {
            "name": "rewardPolicyByClass",
            "type": {
              "array": [
                "u16",
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "userState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          },
          {
            "name": "lastSpinresult",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAdmin",
      "msg": "Invalid admin"
    }
  ]
};
