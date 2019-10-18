$(document).on("click", "#mynews", function () {
    console.log("mynews clicked");
    window.location.href = "/mynews"
});
$(document).on("click", "#scrape", function () {
    console.log("scrape clicked");
    window.location.href = "/"
})
$(document).on("click", "home", function () {
    console.log("home clicked");
    window.location.href = "/"
})

$(document).on("click", ".savearticle", function () {
    console.log("save clicked")
    var id = $(this).attr("data-id");

    $.ajax({
        method: "PUT",
        url: "/articles/save/" + id,
    }).then(function (data) {
        location.reload(); //empties notes section
        console.log(data);
    });
});

$(document).on("click", ".deletearticle", function () {
    console.log("save clicked")
    var id = $(this).attr("data-id");

    $.ajax({
        method: "PUT",
        url: "/articles/unsave/" + id,
    }).then(function (data) {
        location.reload();
    });
});

$(document).on("click", "#viewnotes", function () {
    console.log("View notes clicked")
    var id = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/articlenote" + id,
    }).then(function (data) {
        console.log(data);
        $("#modalnote").find("#thenotes").empty();

        console.log(data.notes);
        for (var i = 0; i < data.notes.length; i++) {
            var title = data.notes[i].title;
            var comment = data.notes[i].comment;
            var idNote = data.notes[i]._id;
            console.log(title, comment)

            var tempNote = `<div class="list-group-item list-group-item-action  mb-1">
            <div class="justify-content-between">
              <h5 class="mb-1">${title}</h5>
              <div class="row">
              <div class="col-11">
              <small>${comment}</small>
              </div>
              <div class="col-1">
              <button class="btn-sm btn-danger deletenote" data-toggle="modal" data-target="#modalnote" data-idNote="${idNote}" data-idArticle="${id}">X</button>
              </div>
            </div></div>`

            console.log(tempNote);

            $("#modalnote").find("#thenotes").append(tempNote);
        }

        var tempButton = (`<button class="btn-sm btn-success" id="savenote" data-toggle="modal" data-target="#modalnote" data-id="${id}">Add to Saved!</button>`)
        $("#modalnote").find("#buttonsaved").empty();
        $("#modalnote").find("#buttonsaved").append(tempButton);

        $("#modalnote").modal("show")
    });
});

$(document).on("click", "savenote", function () {
    console.log("Save note clicked");
    var id = $(this).attr("data-id");
    var title = $("#notetitle").val().trim();
    var comment = $("#notebody").val().trim();

    if (!title) {
        console.log("title empty")
    }
    else {
        $.ajax({
            method: "POST",
            url: "/articlenote/" + id,
            data: {
                title: title,
                comment: comment
            }
        }).then(function (data) {
            console.log(data);
        });

        $("#notetitle").val("");
        $("#notebody").val("");
    }
});

$(document).on("click", ".deletenote", function () {
    console.log("Delete clicked");

    var idArticle = $(this).attr("data-idArticle");
    var idNote = $(this).attr("data-idNote");

    $.ajax({
        method: "DELETE",
        url: "/notes/delete/" + idNote,
    }).then(function (data) {
        console.log(data);
    });
});
