package main

import (
	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/functions/tasks"
)

var tasksHandler = functions.NewHTTP("tasks", func() (functions.HTTPHandler, error) {
	return tasks.InitializeHandler(secretConfig)
})
