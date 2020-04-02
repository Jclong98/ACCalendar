var months = [
    'january', 
    'february', 
    'march', 
    'april', 
    'may', 
    'june', 
    'july', 
    'august', 
    'september', 
    'october', 
    'november', 
    'december',
]

var monthsAbbr = {
    "january":"Jan.",
    "february":"Feb.",
    "march":"Mar.",
    "april":"Apr.",
    "may":"May",
    "june":"June",
    "july":"July",
    "august":"Aug.",
    "september":"Sept.",
    "october":"Oct.",
    "november":"Nov.",
    "december":"Dec.",
}

// select the current month
var d = new Date();
var monthnum = d.getMonth();
console.log(`Current Month: ${months[monthnum]}`)


// create and a tr element filled with th elements from a given list
function createHeader(list) {
    var tr = document.createElement("tr");

    for (var h of list) {
        var th = document.createElement("th");
        th.innerHTML = h;
        tr.append(th)
    }

    return tr;
}

// create an image object and make the 
// correct source based on the script root
function createImg(id, ext) {
    var img = document.createElement("IMG");
    img.src = `${$SCRIPT_ROOT}/static/${id}.${ext}`;
    return img;
}

// create the hours widget
function createHours() {
    return document.createElement('td');
}

// create seasonality widget.
function createCalendar(months) {
    var widget = document.createElement('td');
    widget.classList.add("seasonality");

    for (let [month, abbr] of Object.entries(monthsAbbr)) {
        let outer = document.createElement("div");
        outer.classList.add("outer");

        let inner = document.createElement("span");
        inner.style = "border-radius: 3px; padding: 2px 4px; display: flex;";
        outer.appendChild(inner);

        inner.innerHTML = abbr;

        if (months[month]) {
            inner.style.backgroundColor = "yellowgreen";
            inner.style.color = "rgb(50, 90, 10)"
        }

        widget.appendChild(outer);
    }

    return widget;
}

function createRow(index, row) {
    // console.log(index, row);
    var r = document.createElement("tr");

    var td_index = document.createElement("td");
    td_index.innerHTML = index;

    var td_image = document.createElement("td");
    td_image.append(createImg(row['image'], 'webp'));

    var td_name = document.createElement("td");
    td_name.innerHTML = row['name'];

    var td_price = document.createElement("td");
    td_price.innerHTML = row['price'];

    var td_location = document.createElement("td");
    td_location.innerHTML = row['location'];

    var td_hours = document.createElement("td");
    td_hours.innerHTML = row['time'];

    r.append(
        td_index, 
        td_image,
        td_name,
        td_price,
        td_location,
        td_hours,
        createCalendar(row),
    )

    if (row['shadow_size']) {
        var fish_td = document.createElement("td");
        var fish_div = document.createElement("div");
        fish_div.style.display = "flex";
        fish_div.style.alignItems = "center";
        fish_div.style.justifyContent = "center";

        var fish_span = document.createElement("span");
        fish_span.style.marginRight = "5px";
        fish_span.innerHTML = row['shadow_size'];

        var max_width = 50;
        var img_size = max_width/6 * row['shadow_size'] + max_width/2;

        var fish_img = createImg('fish', 'svg');
        fish_img.style.width = `${img_size}px`;
    
        fish_div.append(fish_span, fish_img)
        fish_td.append(fish_div);
        r.append(fish_td);
    }

    return r;
}

// use jquery and ajax to query the server and get a response
function updateFilter() {

    console.log("updating...");

    // this is the actual query to the server
    $.getJSON(
        // location of url we want to contact
        $SCRIPT_ROOT + '/_get_months', 
        
        // json to pass into that url
        // getting the checked property for the month radio widget
        {
            month:$("input[name='month']:checked").val()
        },
        // on success, this function is called
        function(data) {
            for (let type of ['fish', 'bugs']) {
                var output = document.getElementById(type);
                output.innerHTML = '';

                // creating a header
                var headerlist = ['', '', 'Name', 'Price', 'Location', 'Active Hours', 'Seasonality']
                if (type == 'fish')
                    headerlist.push('Shadow Size')

                output.appendChild(createHeader(headerlist));
                

                for (let [index, row] of Object.entries(data[type])) {
                    output.appendChild(createRow(index, row));
                }
            }
        }
    )
}

// when the month radio buttons are changed, we want to run all the backend ajax stuff
$("input[name='month']").change(updateFilter);

$(`#${months[monthnum]}`).click()
