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

$(document).on("pagebeforeshow", "#update-food", function (e, ui) {
    $.each(food_groups, function (idx, v) {
        $("#txtGroupUpdate").append($("<option>", {
            value: v.toLowerCase(),
            text: v
        }));
    });

    $.each(meal_types, function (idx, v) {
        $("#txtTypeUpdate").append($("<option>", {
            value: v.toLowerCase(),
            text: v
        }));
    });

    $("#txtNameUpdate").val(currentFood.name);
    $("#txtGroupUpdate").val(currentFood.group).prop('selected', true);
    $("#txtDateUpdate").val(currentFood.date);
    $("#txtTimeUpdate").val(currentFood.time);
    $("#txtTypeUpdate").val(currentFood.type).prop('selected', true);
    $("#txtDateUpdate").val(currentFood.date);
    $("#txtNoteUpdate").val(currentFood.note);
    $("#txtReporterUpdate").val(currentFood.reporter);
});

$(document).on("pagebeforeshow", "#add-note", function () {
    console.log(currentFood);
    $('#txtContent').val(currentFood.note);
});

$(document).on("pagebeforeshow", "#note", function () {
    displayNote();
});

function displayFoods(foods) {
    var listFoods = $("#list-foods");
    listFoods.empty();

    $.each(foods, function (index, food) {
        var li = $("<li />").attr("data-filtertext", food.name);
        var a = $("<a />").addClass("ui-food").attr("id", food.id);

        var txtName = $("<h3 />").text("Name: ");
        var txtGroup = $("<p />").text("Group: ");
        var txtDateTime = $("<p />").text("DateTime: ");
        var txtType = $("<p />").text("Meal Type: ");
        var txtNote = $("<p />").attr('name', 'note').text(food.note).hide();
        var txtReporter = $("<p />").text("Reporter: ");

        txtName.append($("<span />").attr("name", "name").text(food.name));
        txtGroup.append($("<span />").attr("name", "group").text(food.fgroup));
        txtDateTime.append($("<span />").attr("name", "datetime").text(food.date + " " + food.time));
        txtType.append($("<span />").attr("name", "type").text(food.mtype));
        txtReporter.append($("<span />").attr("name", "reporter").text(food.reporter));

        a.append(txtName);
        a.append(txtGroup);
        a.append(txtDateTime);
        a.append(txtType);
        a.append(txtNote);
        a.append(txtReporter);
        li.append(a);

        listFoods.append(li);
    });

    listFoods.listview("refresh");

    listFoods.on("taphold", "li", function () {
        currentFood.id = $(this).find("a.ui-food").attr("id");
        currentFood.name = $(this).find("[name='name']").text();
        currentFood.group = $(this).find("[name='group']").text();
        datetime = $(this).find("[name='datetime']").text().split(' ');
        currentFood.date = datetime[0];
        currentFood.time = datetime[1];
        currentFood.type = $(this).find("[name='type']").text();
        currentFood.note = $(this).find("[name='note']").text();
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

function updateFood() {
    var name = $("#txtNameUpdate").val();
    var group = $("#txtGroupUpdate").val();
    var date = $("#txtDateUpdate").val();
    var time = $("#txtTimeUpdate").val();
    var type = $("#txtTypeUpdate").val();
    var note = $("#txtNoteUpdate").val();
    var reporter = $("#txtReporterUpdate").val();

    var food = {
        id: currentFood.id,
        name: name,
        group: group,
        date: date,
        time: time,
        type: type,
        note: note,
        reporter: reporter
    };

    validateFood(food, function (errMsg) {
        if (errMsg === "") {
            foodHandler.update(food, function () {
                changePage("#index");
            });
        }
    });
}

function displayNote() {
    var listNote = $("#list-note");
    listNote.empty();

    var li = $("<li data-icon='false' />");
    var content = $("<p />").text(currentFood.note);

    li.append(content);
    listNote.append(li);

    listNote.listview("refresh");
}

function addNote() {
    var txtContent = $("#txtContent");

    currentFood.note = txtContent.val();
    foodHandler.update(currentFood, function () {
        changePage('#index')
    });
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
