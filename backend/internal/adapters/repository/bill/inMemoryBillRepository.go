package bill

import (
	"financial/internal/core/domain/bill"
	"sync"
)
type InMemoryBillRepository struct {
	bills []bill.Bill
	mu    sync.Mutex
}

func NewInMemoryBillRepository() *InMemoryBillRepository {
	return &InMemoryBillRepository{}
}

func (r *InMemoryBillRepository) Create(b bill.Bill) (bill.Bill, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.bills = append(r.bills, b)
	return b, nil
}

func (r *InMemoryBillRepository) List() ([]bill.Bill, error) {
    r.mu.Lock()
    defer r.mu.Unlock()
    return r.bills, nil
}
