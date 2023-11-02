function lastnameSearch() {
    window.location.href = "./lastname.html?last_name=" + $("#lastname").val();
}

function lastnameStudent() {
    let hrefString = window.location.href;
    let lastName = hrefString.substring((hrefString.lastIndexOf("=") + 1), hrefString.length);
    $.ajax({
        url: getURL() + "students/search/" + lastName,
        type: "get",
        dataType: "text",
        complete: function() {
            $("#studentLastname").text("Student(s) With Last Name: \"" + lastName + "\"")
        },
        success: function(response) {
            let outputString = "";
            let studentArray = JSON.parse(response);
            for (student in studentArray) {
                if (studentArray[student].last_name == lastName) {
                    outputString += "Record ID: " + studentArray[student].record_id
                    + "\nFirst Name: " + studentArray[student].first_name
                    + "\nLast Name: " + studentArray[student].last_name 
                    + "\nGPA: " + studentArray[student].gpa 
                    + "\nEnrolled: " + studentArray[student].enrolled 
                    + "\n\n";
                }
            }
            $("#output").text(outputString);
        },
        error: function(response) {
            $("#output").text("Error!\nCouldn't find student.");
        }
    });
}

function listStudents() {
    $.ajax({
        url: getURL() + "students",
        type: "get",
        dataType: "text",
        success: function(response) {
            let outputString = "";
            let studentArray = JSON.parse(response).students;
            for (student in studentArray) {
                outputString += "Record ID: " + studentArray[student].record_id
                + "\nFirst Name: " + studentArray[student].first_name
                + "\nLast Name: " + studentArray[student].last_name 
                + "\nGPA: " + studentArray[student].gpa 
                + "\nEnrolled: " + studentArray[student].enrolled 
                + "\n\n";
            }
            $("#output").text(outputString);
        },
        error: function(response) {
            $("#output").text("Error!\nCouldn't find student.");
        }
    });
}

function updateStudent() {
    $.ajax({
        url: getURL() + "students/" + $("#recordID").val(),
        type: "put",
        dataType: "text",
        data: {
            first_name: $("#firstName").val(),
            last_name: $("#lastName").val(),
            gpa: $("#gpa").val(),
            enrolled: $(".enrolled:checked").val()
        },
        success: function(response) {
            $("#output").text("Success!\nStudent updated!");
        },
        error: function(response) {
            $("#output").text("Error!\nCouldn't update student.");
        }
    });
}

function viewStudent() {
    $.ajax({
        url: getURL() + "students/" + $("#recordID").val(),
        type: "get",
        dataType: "text",
        success: function(response) {
            student = JSON.parse(response);
            $("#output").text("First Name: " + student.first_name
            + "\nLast Name: " + student.last_name
            + "\nGPA: " + student.gpa
            + "\nEnrolled: " + student.enrolled);
        },
        error: function(response) {
            $("#output").text("Error!\nCouldn't find student.");
        }
    });
}

function addStudent() {
    $.ajax({
        url: getURL() + "students",
        type: "post",
        dataType: "text",
        data: {
            first_name: $("#firstName").val(),
            last_name: $("#lastName").val(),
            gpa: $("#gpa").val(),
            enrolled: $(".enrolled:checked").val()
        },
        success: function(response) {
            $("#output").text("Success!\nRecord ID: " + JSON.parse(response).record_id);
        },
        error: function(response) {
            $("#output").text("Error!\nCouldn't find student.");
        }
    });
}

function deleteStudent() {
    $.ajax({
        url: getURL() + "students/" + $("#recordID").val(),
        type: "delete",
        dataType: "text",
        success: function(response) {
            $("#output").text("Success!\nStudent deleted.");
        },
        error: function(response) {
            $("#output").text("Error!\nCouldn't delete student.");
        }
    });
}

function getURL() {
    let url = window.location.href;
    let searchTerm = ".com";
    let cutIndex = url.indexOf(searchTerm);
    return url.substring(0, (cutIndex + searchTerm.length)) + "/";
}