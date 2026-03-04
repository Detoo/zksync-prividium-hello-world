## Issues

### Infinite loop getting first transaction receipt

To reproduce:

Run the script to deploy Counter. It succeeded at simulation but stuck at sending the actual transaction.

```shell
# Run with Prividium proxy
$ forge script script/Counter.s.sol --rpc-url http://127.0.0.1:24101/rpc

[⠊] Compiling...
No files changed, compilation skipped
Script ran successfully.

== Logs ==
  ==== Configs ====
  block.chainid: 282
  deployer: 0x5ff4e90Efa2B88cf3cA92D63d244a78a88219Abf
  deployer.balance: 80000000000000000
  ==== Deployed ====
  counter: 0xa37768690efC577459FA742c90d83D9FE018c08C

## Setting up 1 EVM.

==========================

Chain 282

Estimated gas price: 0.000000001 gwei

Estimated total gas used for script: 203856

Estimated amount required: 0.000000000000203856 ETH

==========================
⢀ Sequence #1 on 282 | Waiting for pending transactions
    ⠁ [Pending] 0x4cda6173171b677b240e53ebe9c439c1539c7b9df0a0707c317b2e32fb090a89
    ⠴ [00:02:05] [#########################################################################################################] 1/1 txes (0.0s)
    ⠴ [00:02:05] [-----------------------------------------------------------------------------------------------------] 0/1 receipts (0.0s)
```

in the meantime, the RPC proxy is showing infinite loop getting the receipt

```shell
│  eth_sendRawTransaction
│
│  eth_getTransactionReceipt
│
│  eth_blockNumber
│
│  eth_getTransactionReceipt
│
│  eth_getBlockByNumber
│
│  eth_getTransactionReceipt
│
│  eth_getBlockByNumber
│
│  eth_getTransactionReceipt
│
│  eth_blockNumber
│
│  eth_getTransactionReceipt
│
│  eth_getTransactionReceipt
│
│  eth_blockNumber
```
