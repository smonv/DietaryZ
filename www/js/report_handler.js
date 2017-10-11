var reportHandler = {
    add: function (report, callback) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "INSERT INTO reports(aid, content) VALUES(?,?)",
                    [report.aid, report.content],
                    function () {
                        callback();
                    },
                    onExecuteError
                )
            },
            onTransactionError
        )
    },
    getByAid: function (aid, callback) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "SELECT * FROM reports WHERE aid = ?",
                    [aid],
                    function (tx, results) {
                        callback(results.rows);
                    },
                    onExecuteError
                )
            },
            onTransactionError
        )
    }
};