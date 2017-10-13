var food_groups = ["Dairy", "Fruits", "Meat", "Bread"];
var meal_types = ["Breakfast", "Lunch", "Dinner"];

var currentFood = {
    id: -1,
    name: "",
    group: "",
    date: "",
    time: "",
    type: "",
    note: "",
    reporter: ""
};

$(document).on("pagebeforecreate", function () {
    databaseHandler.createDatabase();
});

$(document).on("pagebeforeshow", "#index", function () {
    foodHandler.readAll(displayFoods);
});

$(document).on("pagebeforeshow", "#add-food", function () {
    $.each(food_groups, function (idx, v) {
        $("#txtGroup").append($("<option>", {
            value: v.toLowerCase(),
            text: v
        }));
    });

    $.each(meal_types, function (idx, v) {
        $("#txtType").append($("<option>", {
            value: v.toLowerCase(),
            text: v
        }));
    });
});

$(document).on("pagebeforeshow", "#update-activity", function () {
    $("#txtNameUpdate").val(currentActivity.name);
    $("#txtLocationUpdate").val(currentActivity.location);
    $("#txtDateUpdate").val(currentActivity.date);
    $("#txtTimeUpdate").val(currentActivity.time);
    $("#txtReporterUpdate").val(currentActivity.reporter);
});

$(document).on("pagebeforeshow", "#reports", function () {
    reportHandler.getByAid(currentActivity.id, displayReports);
});

function displayFoods(foods) {
    var listFoods = $("#list-foods");
    listFoods.empty();

    $.each(foods, function (index, food) {
        var li = $("<li />").attr("data-filtertext", food.name);
        var a = $("<a />").addClass("ui-food").attr("id", food.id);
        var txtName = $("<h3 />").text("Name: ");
        var txtLocation = $("<p />").text("Group: ");
        var txtDate = $("<p />").text("Date: ");
        var txtTime = $("<p />").text("Time: ");
        var txtReporter = $("<p />").text("Reporter: ");

        txtName.append($("<span />").attr("name", "name").text(food.name));
        txtLocation.append($("<span />").attr("name", "group").text(food.group));
        txtDate.append($("<span />").attr("name", "date").text(food.date));
        txtTime.append($("<span />").attr("name", "time").text(food.time));
        txtReporter.append($("<span />").attr("name", "reporter").text(food.reporter));

        a.append(txtName);
        a.append(txtLocation);
        a.append(txtDate);
        a.append(txtTime);
        a.append(txtReporter);
        li.append(a);
        listFoods.append(li);
    });

    listFoods.listview("refresh");

    listFoods.on("taphold", "li", function () {
        currentFood.id = $(this).find("a.ui-food").attr("id");
        currentFood.name = $(this).find("[name='name']").text();
        currentFood.group = $(this).find("[name='group']").text();
        currentFood.date = $(this).find("[name='date']").text();
        currentFood.time = $(this).find("[name='time']").text();
        currentFood.reporter = $(this).find("[name='reporter']").text();

        $('#foodPopup').popup("open");
    });
}

function addFood() {
    var txtName = $("#txtName");
    var txtGroup = $("#txtGroup");
    var txtDate = $("#txtDate");
    var txtTime = $("#txtTime");
    var txtType = $("#txtType");
    var txtNote = $("#txtNote");
    var txtReporter = $("#txtReporter");

    var food = {
        name: txtName.val(),
        group: txtGroup.val(),
        date: txtDate.val(),
        time: txtTime.val(),
        type: txtType.val(),
        note: txtNote.val(),
        reporter: txtReporter.val()
    };

    validateFood(food, function (errMsg) {
        if (errMsg === "") {
            foodHandler.checkDuplicate(food, function (result) {
                if (result.rows.length !== 0) {
                    alert("Event duplicated!");
                } else {
                    foodHandler.create(food, function () {
                        txtName.val("");
                        txtGroup.val("");
                        txtDate.val("");
                        txtTime.val("");
                        txtType.val("");
                        txtNote.val("");
                        txtReporter.val("");
                        changePage("#index");
                    });
                }
            });
        } else {
            alert(errMsg);
        }
    });
}

function deleteFood() {
    var r = confirm("Delete food\nName: " + currentFood.name);
    if (r) {
        foodHandler.delete(currentFood.id, function () {
            changePage("#index");
        });
    }
}

function updateActivity() {
    var name = $("#txtNameUpdate").val();
    var location = $("#txtLocationUpdate").val();
    var date = $("#txtDateUpdate").val();
    var time = $("#txtTimeUpdate").val();
    var reporter = $("#txtReporterUpdate").val();

    var activity = {
        id: currentActivity.id,
        name: name,
        location: location,
        date: date,
        time: time,
        reporter: reporter
    };

    validateActivity(activity, function (error) {
        if (error !== "") {
            alert(error);
        } else {
            activityHandler.checkDuplicate(activity, function (results) {
                if (results.rows.length !== 0) {
                    alert("Event duplicated!");
                } else {
                    activityHandler.update(
                        activity,
                        function () {
                            changePage("#index");
                        });
                }
            });
        }
    });
}

function displayReports(reports) {
    var listReports = $("#list-reports");
    listReports.empty();

    for (var i = 0; i < reports.length; i++) {
        var report = reports[i];
        var li = $("<li data-icon='false' />");
        var a = $("<a />").attr("id", report.aid);
        var content = $("<p />").text(report.content);

        a.append(content);
        li.append(a);
        listReports.append(li);
    }

    listReports.listview("refresh");
}

function addReport() {
    var txtContent = $("#txtContent");

    reportHandler.add(
        {
            aid: currentActivity.id,
            content: txtContent.val(),
        },
        function () {
            changePage("#index");
        }
    )
}

function validateFood(food, callback) {
    var errors = [];
    if (food.name === "") {
        errors.push("Name required.\n");
    }
    if (food.group === "") {
        errors.push("Group required.\n");
    }
    if (food.date === "") {
        errors.push("Date required.\n");
    }
    if (food.time === "") {
        errors.push("Time required.\n");
    }
    if (food.reporter === "") {
        errors.push("Reporter required.\n");
    }

    var msg = "";

    $.each(errors, function (i, v) {
        msg += v;
    });

    callback(msg);
}

function changePage(page) {
    $(":mobile-pagecontainer").pagecontainer("change", page, {
        reload: false,
        allowSamePageTransition: true,
        transition: "none"
    });
}
