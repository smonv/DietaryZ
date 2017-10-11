var databaseHandler;
databaseHandler = {
    db: null,
    createDatabase: function () {
        if (this.db == null) {
            this.db = window.openDatabase(
                "iDiscovery.db",
                "1.0",
                "iDiscovery database",
                1000000,
                function (err) {
                    console.log("Failed to create database. " + err);
                }
            );
            this.db.transaction(
                function (tx) {
                    tx.executeSql(
                        "CREATE TABLE IF NOT EXISTS activities(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT, date TEXT, time TEXT, reporter TEXT)",
                        [],
                        function () {
                            console.log("Successfully create table activities.");
                        },
                        onExecuteError
                    );
                },
                onTransactionError
            );
            this.db.transaction(
                function (tx) {
                    tx.executeSql(
                        "CREATE TABLE IF NOT EXISTS reports(id INTEGER PRIMARY KEY AUTOINCREMENT, aid INTEGER, content TEXT)",
                        [],
                        function () {
                            console.log("Successfully create table reports.");
                        },
                        onExecuteError
                    )
                },
                onTransactionError
            )
        }
    }
};

function onTransactionError(err) {
    console.log("TX: " + err.message);
}

function onExecuteError(err) {
    console.log("EXEC: " + err.message);
}

