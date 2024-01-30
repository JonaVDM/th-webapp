package main

import (
	"log"
	"os"
	"strings"

	_ "github.com/jonavdm/th-webapp/migrations"
	"github.com/jonavdm/th-webapp/ui"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

func main() {
	app := pocketbase.New()

	automigrate := strings.HasPrefix(os.Args[0], os.TempDir())
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: automigrate,
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET(
			"/*",
			apis.StaticDirectoryHandler(ui.BuildDirFS, true),
		)

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
