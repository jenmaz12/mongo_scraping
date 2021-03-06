$(document).ready(function () {
  fetch("/scrape").then(function (response) {
    function populateArticles() {
      $.getJSON("/articles", function (data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
          // Display the apropos information on the page
          $("#articles").append("<div class='articleLink'><p class= 'article' data-toggle='modal' data-target='#notes' data-id='" + data[i]._id + "'>" + data[i].title + "</p>" + "<a href='" + data[i].link + "'>" + data[i].link + "</a></div>");
        }
      });
    }
    populateArticles();

    $(document).on("click", "#scrapeBtn", function () {
      $.ajax({
        method: "GET",
        url: "/scrape"
      })
        .then(function (response) {
          $("#articles").empty();
          populateArticles();
        })
    })
    // Whenever someone clicks a p tag
    $(document).on("click", "p", function () {
      // Empty the notes from the note section
      $("#notes").find(".modal-title").empty();
      $("#notes").find(".modal-body").empty();
      // Save the id from the p tag
      var thisId = $(this).attr("data-id");

      // Now make an ajax call for the Article
      $.ajax({
        method: "GET",
        url: "/articles/" + thisId
      })
        // With that done, add the note information to the page
        .then(function (data) {
          console.log(data);
          // The title of the article
          $("#notes").find(".modal-title").append("<h2>" + data.title + "</h2>");
          // An input to enter a new title
          $("#notes").find(".modal-body").append("<p class='noteSub'>Note Title</p><input id='titleinput' name='title' >");
          // A textarea to add a new note body
          $("#notes").find(".modal-body").append("<p class='noteSub'>Note Body</p><textarea id='bodyinput' name='body'></textarea>");
          // A button to submit a new note, with the id of the article saved to it
          $("#notes").find(".modal-body").append("<button class='btn btn-secondary' data-id='" + data._id + "' id='savenote'>Save Note</button>");

          // If there's a note in the article
          if (data.note) {
            // Place the title of the note in the title input
            $("#titleinput").val(data.note.title);
            // Place the body of the note in the body textarea
            $("#bodyinput").val(data.note.body);
          }

          $('#notes').modal('show');
        });
    });

    // When you click the savenote button
    $(document).on("click", "#savenote", function () {
      // Grab the id associated with the article from the submit button
      var thisId = $(this).attr("data-id");

      // Run a POST request to change the note, using what's entered in the inputs
      $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          // Value taken from title input
          title: $("#titleinput").val(),
          // Value taken from note textarea
          body: $("#bodyinput").val()
        }
      })
        // With that done
        .then(function (data) {
          // Log the response
          console.log(data);
          // Empty the notes section
          $("#notes").empty();
        });

      // Also, remove the values entered in the input and textarea for note entry
      $("#titleinput").val("");
      $("#bodyinput").val("");
    });
  })
})
