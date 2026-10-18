package db

import (
	"database/sql"
	"fmt"
)

type Store struct {
	db *sql.DB
}

func (s *Store) GetUser(id string) (*sql.Rows, error) {
	// True Positive: Go SQL concatenation with fmt.Sprintf (RPM-SAST-SQLI-01)
	return s.db.Query(fmt.Sprintf("SELECT id, name, role FROM users WHERE id = '%s'", id))
}
