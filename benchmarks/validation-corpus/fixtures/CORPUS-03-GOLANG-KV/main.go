package main

import (
	"fmt"
	"net/http"
	"github.com/hashicorp/serf-kv-fixture/kv"
	"github.com/hashicorp/serf-kv-fixture/network"
)

func main() {
	cache := &kv.Cache{}
	cache.Set("status", "ready")
	client := network.NewSecureClient()
	fmt.Println("KV store ready with secure client:", client != nil)
}
