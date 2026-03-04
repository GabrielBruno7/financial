package debug

import (
	"encoding/json"
	"fmt"
)

func Print(label string, value any) {
	b, err := json.MarshalIndent(value, "", "  ")
	if err != nil {
		fmt.Printf("%s: failed to marshal debug value: %v\n", label, err)
		return
	}

	fmt.Printf("%s:\n%s\n", label, string(b))
}
