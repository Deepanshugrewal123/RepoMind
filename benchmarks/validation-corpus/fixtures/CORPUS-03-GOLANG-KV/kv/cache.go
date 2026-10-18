package kv

import "sync"

type Cache struct {
	data sync.Map
}

func (c *Cache) Set(key string, val interface{}) {
	c.data.Store(key, val)
}

func (c *Cache) Get(key string) (interface{}, bool) {
	return c.data.Load(key)
}
