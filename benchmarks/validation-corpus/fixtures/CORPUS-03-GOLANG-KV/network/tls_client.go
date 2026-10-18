package network

import (
	"crypto/tls"
	"net/http"
)

func NewInsecureClient() *http.Client {
	// True Positive: InsecureSkipVerify: true disables TLS verification (RPM-SAST-TLS-08)
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	return &http.Client{Transport: tr}
}
