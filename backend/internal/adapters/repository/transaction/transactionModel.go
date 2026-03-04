package transaction

import "time"

type TransactionModel struct {
	ID        string    `gorm:"type:uuid;primaryKey"`
	Name      string    `gorm:"column:name;not null"`
	Amount    float64   `gorm:"column:amount;not null"`
	Type      string    `gorm:"column:type;not null"`
	CreatedAt time.Time `gorm:"column:created_at;autoCreateTime"`
}

func (TransactionModel) TableName() string {
	return "transactions"
}
