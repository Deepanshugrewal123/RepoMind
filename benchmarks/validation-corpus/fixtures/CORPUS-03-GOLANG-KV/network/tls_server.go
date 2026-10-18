package network

import (
	"crypto/tls"
	"net/http"
)

func NewSecureClient() *http.Client {
	// True Negative trap: InsecureSkipVerify: false explicitly enforces TLS validation
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: false},
	}
	return &http.Client{Transport: tr}
}
