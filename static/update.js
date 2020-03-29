var months = [
    'jan', 'feb', 'mar', 'apr', 
    'may', 'jun', 'jul', 'aug', 
    'sep', 'oct', 'nov', 'dec',
]

// select the current month
var d = new Date();
var monthnum = d.getMonth();
console.log(`${months[monthnum]}-label`)

function updateFilter() {

    console.log("updating...");

    // this is the actual query to the server
    $.getJSON(
        // location of url we want to contact
        $SCRIPT_ROOT + '/_get_months', 

        // json to pass into that url
        // getting the checked property for each checkbox
        {
            January:   $('#jan-check').prop('checked'),
            February:  $('#feb-check').prop('checked'),
            March:     $('#mar-check').prop('checked'),
            April:     $('#apr-check').prop('checked'),
            May:       $('#may-check').prop('checked'),
            June:      $('#jun-check').prop('checked'),
            July:      $('#jul-check').prop('checked'),
            August:    $('#aug-check').prop('checked'),
            September: $('#sep-check').prop('checked'),
            October:   $('#oct-check').prop('checked'),
            November:  $('#nov-check').prop('checked'),
            December:  $('#dec-check').prop('checked'),
        },

        // what happens when the json is successfully passed
        function(data) {
            for (let [key, rows] of Object.entries(data)) {
                
                // $("#result").text(data);
                var table = $(`#${key}-output-table`);
                table.text(``);
                
                // creating the header again after it is deleted
                var header = document.createElement("tr");
                var th = document.createElement("th");
                th.innerHTML = "Name";
                header.append(th);
                
                th = document.createElement("th");
                th.innerHTML = "Price";
                header.append(th);

                th = document.createElement("th");
                th.innerHTML = "Location";
                header.append(th);
                
                th = document.createElement("th");
                th.innerHTML = "Hours";
                header.append(th);
                
                table.append(header);
                
                for (let row of rows) {
                    console.log(row);
                    
                    // creating a row to append to the table in html
                    var htmlRow = document.createElement("tr");
                    table.append(htmlRow);
                    
                    var nameCell = document.createElement("td");
                    nameCell.innerHTML = row[0];
                    htmlRow.append(nameCell);
                    
                    var priceCell = document.createElement("td");
                    priceCell.innerHTML = row[1];
                    htmlRow.append(priceCell);
                    
                    var locationCell = document.createElement("td");
                    locationCell.innerHTML = row[2];
                    htmlRow.append(locationCell);
                    
                    var hoursCell = document.createElement("td");
                    hoursCell.innerHTML = row[3];
                    htmlRow.append(hoursCell);
                    
                    //displaying active months calendar
                }
            }    
        }
    );

    return false;
}

// when month-check is changed, we want to run all the backend ajax stuff
$(".month-check").change(updateFilter);

// a function to control the color of the checked boxes
function toggleColor(element) {
    element.addEventListener('click', () => {
        if ($(`#${element.htmlFor}`).prop('checked'))
            element.classList.remove("active")
        else
            element.classList.add("active")
    })
}

// finding all month toggles and having the toggleColor function add 
// event listeners to toggle their colors when clicked according to the 
// checkboxes they are linked to
var monthlabels = $(".month");
for (var i = 0; i < monthlabels.length; i++) {
    toggleColor(monthlabels[i]);
}


$(`#${months[monthnum]}-label`).click()