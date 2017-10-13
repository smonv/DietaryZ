var foodHandler = {
    create: function (food, callback) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "INSERT INTO foods(name, fgroup, date, time, mtype, note, reporter) VALUES (?,?,?,?,?,?,?)",
                    [food.name, food.group, food.date, food.time, food.type, food.note, food.reporter],
                    function () {
                        callback();
                    },
                    onExecuteError
                );
            }, onTransactionError
        );
    },
    readAll: function (callback) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "SELECT * FROM foods",
                    [],
                    function (tx, result) {
                        callback(result.rows);
                    },
                    onExecuteError
                )
            }, onTransactionError
        );
    },
    checkDuplicate: function (food, callback) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "SELECT 1 FROM foods WHERE name = ? AND fgroup = ? AND date = ?",
                    [food.name, food.group, food.date],
                    function (tx, result) {
                        callback(result);
                    },
                    onExecuteError
                );
            },
            onTransactionError
        )
    },
    update: function (food, callback) {

    },
    delete: function (id, callback) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "DELETE FROM foods WHERE id = ?",
                    [id],
                    function () {
                        callback();
                    },
                    onExecuteError
                );
            },
            onTransactionError
        )
    }
};