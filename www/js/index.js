var currentActivity = {
    id: -1,
    name: "",
    location: "",
    date: "",
    time: "",
    reporter: ""
};

$(document).on("pagebeforecreate", function () {
    databaseHandler.createDatabase();
});

$(document).on("pagebeforeshow", "#index", function () {
    activityHandler.readAll(displayActivities);
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

function displayActivities(activities) {
    var listActivities = $("#list-activities");
    listActivities.empty();
    for (var i = 0; i < activities.length; i++) {
        var activity = activities[i];
        var li = $("<li />").attr("data-filtertext", activity.name);
        var a = $("<a />").addClass("ui-activity").attr("id", activity.id);
        var txtName = $("<h3 />").text("Name: ");
        var txtLocation = $("<p />").text("Location: ");
        var txtDate = $("<p />").text("Date: ");
        var txtTime = $("<p />").text("Time: ");
        var txtReporter = $("<p />").text("Reporter: ");

        txtName.append($("<span />").attr("name", "name").text(activity.name));
        txtLocation.append($("<span />").attr("name", "location").text(activity.location));
        txtDate.append($("<span />").attr("name", "date").text(activity.date));
        txtTime.append($("<span />").attr("name", "time").text(activity.time));
        txtReporter.append($("<span />").attr("name", "reporter").text(activity.reporter));

        a.append(txtName);
        a.append(txtLocation);
        a.append(txtDate);
        a.append(txtTime);
        a.append(txtReporter);
        li.append(a);
        listActivities.append(li);
    }

    listActivities.listview("refresh");

    listActivities.on("taphold", "li", function () {
        currentActivity.id = $(this).find("a.ui-activity").attr("id");
        currentActivity.name = $(this).find("[name='name']").text();
        currentActivity.location = $(this).find("[name='location']").text();
        currentActivity.date = $(this).find("[name='date']").text();
        currentActivity.time = $(this).find("[name='time']").text();
        currentActivity.reporter = $(this).find("[name='reporter']").text();

        $('#activityPopup').popup("open");
    });
}

function addActivity() {
    var txtName = $("#txtName");
    var txtLocation = $("#txtLocation");
    var txtDate = $("#txtDate");
    var txtTime = $("#txtTime");
    var txtReporter = $("#txtReporter");

    var activity = {
        name: txtName.val(),
        location: txtLocation.val(),
        date: txtDate.val(),
        time: txtTime.val(),
        reporter: txtReporter.val()
    };

    validateActivity(activity, function (error) {
        if (error === "") {
            activityHandler.checkDuplicate(activity, function (results) {
                if (results.rows.length !== 0) {
                    alert("Event duplicated!");
                } else {
                    activityHandler.create(
                        activity,
                        function () {
                            txtName.val("");
                            txtLocation.val("");
                            txtDate.val("");
                            txtTime.val("");
                            txtReporter.val("");
                            changePage("#index");
                        });
                }
            });
        } else {
            alert(error);
        }
    });

}

function deleteActivity() {
    var r = confirm("Delete activity\nName: " + currentActivity.name);
    if (r) {
        activityHandler.delete(currentActivity.id, function () {
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
        var report = reports[i]
        var li = $("<li data-icon='false' />");
        var a = $("<a />").attr("id", report.aid);
        var content = $("<p />").text(report.content)

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

function validateActivity(activity, callback) {
    var errors = [];
    if (activity.name === "") {
        errors.push("Name required.\n");
    }
    if (activity.date === "") {
        errors.push("Date required.\n");
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
