package trace

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

var gcpOnce sync.Once

type GCPInstance struct {
	Hostname    string `json:"hostname"`
	Image       string `json:"image"`
	MachineType string `json:"machineType"`
	Name        string `json:"name"`
	Zone        string `json:"zone"`
}

var gcpData *GCPInstance

func loadGoogleCloudData() *GCPInstance {
	gcpOnce.Do(func() {
		client := &http.Client{Timeout: time.Second}
		req, _ := http.NewRequest("GET", "http://metadata.google.internal/computeMetadata/v1/instance/?recursive=true", nil)
		res, err := client.Do(req)
		if err != nil {
			log.Printf("could not load Google Cloud instance data: %v", err)
			return
		}

		if res.StatusCode > 299 {
			log.Printf("could not load Google Cloud instance data: unexpected response %d", res.StatusCode)
			return
		}

		var instance GCPInstance
		if err := json.NewDecoder(res.Body).Decode(&instance); err != nil {
			log.Printf("could not decode Google Cloud instance data: %v", err)
			return
		}

		gcpData = &instance
	})
	return gcpData
}

func hostFields() interface{} {
	data := loadGoogleCloudData()
	if data == nil {
		return nil
	}

	typeComponents := strings.Split(data.MachineType, "/")
	machineType := typeComponents[len(typeComponents)-1]

	return struct {
		Hostname string `json:"hostname"`
		ID       string `json:"id"`
		Name     string `json:"name"`
		Type     string `json:"type"`
	}{
		Hostname: data.Hostname,
		ID:       data.Name,
		Name:     data.Name,
		Type:     machineType,
	}
}

func cloudFields() interface{} {
	data := loadGoogleCloudData()
	if data == nil {
		return nil
	}

	zoneComponents := strings.Split(data.Zone, "/")
	zone := zoneComponents[len(zoneComponents)-1]

	return struct {
		Provider  string `json:"provider"`
		AccountID string `json:"account.id"`
		Zone      string `json:"zone"`
	}{
		Provider:  "gcp",
		AccountID: os.Getenv("GOOGLE_PROJECT"),
		Zone:      zone,
	}
}
