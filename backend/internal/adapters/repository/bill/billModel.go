package bill

import "time"

type BillModel struct {
	ID        string     `gorm:"type:uuid;primaryKey"`
	Name      string     `gorm:"column:name;not null"`
	Amount    float64    `gorm:"column:amount;not null"`
	IsPaid    bool       `gorm:"column:is_paid;not null"`
	CreatedAt time.Time  `gorm:"column:created_at;autoCreateTime"`
	UpdatedAt *time.Time `gorm:"column:updated_at;autoUpdateTime"`
}

func (BillModel) TableName() string {
	return "bills"
}
