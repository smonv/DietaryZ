var activityHandler = {
    create: function (a, callback) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "INSERT INTO activities(name, location, date, time, reporter) VALUES (?,?,?,?,?)",
                    [a.name, a.location, a.date, a.time, a.reporter],
                    function () {
                        callback();
                    },
                    onExecuteError
                );
            },
            onTransactionError
        );
    },
    readAll: function (callback) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "SELECT * FROM activities",
                    [],
                    function (tx, results) {
                        callback(results.rows);
                    }
                )
            }
        )
    },
    update: function (a, callback) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "UPDATE activities SET name = ?, location = ?, date = ?, time = ?, reporter = ? WHERE id = ?",
                    [a.name, a.location, a.date, a.time, a.reporter, a.id],
                    function () {
                        callback();
                    },
                    onExecuteError
                )
            },
            onTransactionError
        )
    },
    delete: function (id, callback) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "DELETE FROM activities WHERE id = ?",
                    [id],
                    function () {
                        callback();
                    },
                    onExecuteError
                );
            },
            onTransactionError
        )
    },
    checkDuplicate: function (activity, callback) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "SELECT 1 FROM activities WHERE name = ? AND date = ?",
                    [activity.name, activity.date],
                    function (tx, results) {
                        callback(results);
                    },
                    onExecuteError
                );
            },
            onTransactionError
        )
    }
};