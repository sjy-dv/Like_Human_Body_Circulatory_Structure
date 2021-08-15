package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

type VisualData struct {
	VisualObject string `json:"visual_object"`
}

func Brain_process(w http.ResponseWriter, r *http.Request) {

	body, _ := ioutil.ReadAll(r.Body)
	Indata := VisualData{}
	_ = json.Unmarshal(body, &Indata)

	var output string

	if strings.Contains(Indata.VisualObject, "red") {
		output = "apple"
	}

	if strings.Contains(Indata.VisualObject, "yellow") {
		output = "orange"
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"result": output})
}

func ResponseJSON(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		next(w, r)
	}
}

func main() {

	r := mux.NewRouter()

	r.HandleFunc("/look_object", ResponseJSON(Brain_process)).Methods("POST")

	http.ListenAndServe(":8082", r)
}
