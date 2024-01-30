package ui

import (
	"embed"

	"github.com/labstack/echo/v5"
)

//go:embed all:build
var buildDir embed.FS
var BuildDirFS = echo.MustSubFS(buildDir, "build")
