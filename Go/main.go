package main

import (
	"context"
	"fmt"
	"log"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
)

func main() {
	// https://mainnet.infura.io/v3/49c954e23a6f4cd0a93b9ee5a2067547
	// curl --url https://mainnet.infura.io/v3/49c954e23a6f4cd0a93b9ee5a2067547 \
	//   -X POST \
	//   -H "Content-Type: application/json" \
	//   -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

	// curl --url https://mainnet.infura.io/v3/49c954e23a6f4cd0a93b9ee5a2067547 \
	//   -X POST \
	//   -H "Content-Type: application/json" \
	//   -d '{"jsonrpc":"2.0","method":"eth_getBlockTransactionCountByNumber","params":["latest"],"id":1}'

	client, err := ethclient.Dial("wss://sepolia.infura.io/ws/v3/49c954e23a6f4cd0a93b9ee5a2067547")
	if err != nil {
		log.Fatalf("Connect: \n\t%v", err)
	}

	contractAddress := common.HexToAddress("0x21c2c96dbfa137e23946143c71ac8330f9b44001")
	query := ethereum.FilterQuery{
		Addresses: []common.Address{contractAddress},
	}

	logs := make(chan types.Log)
	sub, err := client.SubscribeFilterLogs(context.Background(), query, logs)
	if err != nil {
		log.Fatal(err)
	}

	for {
		select {
		case err := <-sub.Err():
			log.Fatal(err)
		case vLog := <-logs:
			fmt.Println(vLog) // pointer to event log
		}
	}
}