$(document).on("click", "#mynews", function() {
    window.location.href = "/mynews";
});

$(document).on("click", "#scrape", function() {
    window.location.href = "/";
});

$(document).on("click", "#home", function() {
    window.location.href = "/";
});

$(document).on("click", ".savearticle", function () {
    var id = $(this).attr("data-id");

    $.ajax({
        method: "PUT",
        url: "/articles/save/" + id,
    })
        .then(function (data) {
            location.reload();
            console.log(data);
        });
});

$(document).on("click", ".deletearticle", function () {
    var id = $(this).attr("data-id");

    $.ajax({
        method: "PUT",
        url: "/articles/unsave/" + id,
    })
        .then(function (data) {
            location.reload();
        });
});

$(document).on("click", "#viewnotes", function () {
    var id = $(this).attr("data-id");
    
    $.ajax({
        method: "GET",
        url: "/articlenote/" + id,
    })
        .then(function (data) {
            console.log(data);
            $("#modalnote").find("#thenotes").empty();

            console.log(data.notes)
            for (let i = 0; i < data.notes.length; i++) {
                let title = data.notes[i].title
                let comment = data.notes[i].comment
                let idNote = data.notes[i]._id
                console.log(title, comment)

                let tempNote = `<div class="list-group-item list-group-item-action  mb-1">
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

                console.log(tempNote)

                $("#modalnote").find("#thenotes").append(tempNote);
            }


            let tempButton = (`<button class="btn-sm btn-success" id="savenote" data-toggle="modal" data-target="#modalnote" data-id="${id}">Add to Saved!</button>`)
            $("#modalnote").find("#buttonsaved").empty();
            $("#modalnote").find("#buttonsaved").append(tempButton);

            $("#modalnote").modal("show")

        });
})

$(document).on("click", "#savenote", function () {
    var id = $(this).attr("data-id");
    var title = $("#notetitle").val().trim();
    var comment = $("#notebody").val().trim();

    if (!title) {
        console.log("Title is empty")
    }
    else {
        $.ajax({
            method: "POST",
            url: "/articlenote/" + id,
            data: {
                title: title,
                comment: comment
            }
        })
            .then(function (data) {
                console.log(data);
            });
        $("#notetitle").val("");
        $("#notebody").val("");
    }
});

$(document).on("click", ".deletenote", function () {

    var idArticle = $(this).attr("data-idArticle");
    var idNote = $(this).attr("data-idNote");

    $.ajax({
        method: "DELETE",
        url: "/notes/delete/" + idNote,
    })
        .then(function (data) {

            console.log(data);

        });
});

