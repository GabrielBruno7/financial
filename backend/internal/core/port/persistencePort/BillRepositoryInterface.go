package persistencePort

import (
	domain "financial/internal/core/domain/bill"
)

type BillRepositoryInterface interface {
	Create(bill domain.Bill) (domain.Bill, error)
	List() ([]domain.Bill, error)
}
