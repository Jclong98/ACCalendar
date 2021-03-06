const MONTHS = [
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

const MONTHS_ABBR = {
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

// this will be filled when getData() is called;
var catches = {
    'fish':[],
    'bugs':[],
};

// select the current month
var d = new Date();
const MONTH_NUM = d.getMonth();
console.log(`Current Month: ${MONTHS[MONTH_NUM]}`)


// create an image object and make the 
// correct source based on the script root
function createImg(id, ext) {
    var img = document.createElement("IMG");
    img.src = `${$SCRIPT_ROOT}/static/${id}.${ext}`;
    img.alt = id;
    return img;
}


// create the hours widget
function createHours() {
    return document.createElement('td');
}


// create seasonality widget.
function createCalendar(months) {
    var widget = document.createElement('div');
    widget.classList.add("seasonality");

    for (let [month, abbr] of Object.entries(MONTHS_ABBR)) {
        let outer = document.createElement("div");

        // highlighting the current month in the calendar
        if (month == $("input[name='month']:checked").val()) {
            outer.classList.add("current");
        }

        let inner = document.createElement("span");        
        inner.innerHTML = abbr;
        
        // checking if the month being iterated is on or off
        if (months[month]) {
            inner.classList.add("active");
        }
        
        outer.appendChild(inner);
        widget.appendChild(outer);
    }

    return widget;
}


// create a .catch div and fill it with indformation from index, row
function createCatch(index, row) {
    let catchDiv = document.createElement("div");
    catchDiv.classList.add("catch");

    // determine if this catch is coming into season or going out of season
    m = $("input[name='month']:checked").val();
    mIndex = MONTHS.indexOf(m);

    if (row[m]) {
        
        // special cases for january and december require the use 
        // of ternary operators because javascript does not support 
        // negative indexing 😡
        if (!row[MONTHS[(mIndex != 0) ? mIndex - 1 : 11]]) {
            catchDiv.classList.add("coming-in");
        }
        if (!row[MONTHS[(mIndex != 11) ? mIndex + 1 : 0]]) {
            catchDiv.classList.add("going-out");
        }
    }

    // icon
    let img = createImg(row['image'], 'png');
    img.classList.add("icon");

    // fishnum + name of fish
    let name = document.createElement("span");
    name.classList.add("name");
    name.innerHTML = `${index}. ${row['name']}`;

    // location
    let location = document.createElement("location");
    location.classList.add("location");
    location.innerHTML = `<i class="fas fa-map-marker-alt map-marker"></i> ${row['location']}`;

    // time
    let time = document.createElement("time");
    time.classList.add("time");
    time.innerHTML = `<i class="fas fa-clock clock"></i>  ${row['time']}`;

    // price
    let price = document.createElement("span");
    price.classList.add("price");
    price.innerHTML = `<i class="fas fa-bell bell"></i> ${row['price']}`;

    // seasonality
    let seasonality = createCalendar(row);

    // setting color based on month

    catchDiv.append(
        img,
        name,
        price,
        location,
        time,
        seasonality,
    )

    // shadow size
    if (row['shadow_size'])
    {
        let shadowSize = document.createElement("span");
        shadowSize.classList.add("shadow-size");
        shadowSize.innerHTML = row['shadow_size'];

        let shadowImg;

        if (row['shadow_size'] == "Narrow") {
            shadowImg = createImg('fish-narrow', 'svg');
            shadowImg.style.width = `${8 * row['shadow_size'] + 10}px`;
        }
        else if (row['shadow_size'].includes("Fin")) {
            shadowImg = createImg('fish-fin', 'svg');
            shadowImg.style.width = `${8 * row['shadow_size'].split(' ')[0] + 10}px`;
        }
        else {
            shadowImg = createImg('fish', 'svg');
            shadowImg.style.width = `${8 * row['shadow_size'] + 10}px`;
        }
        
        shadowImg.classList.add("shadow-img");

        catchDiv.append(shadowSize, shadowImg);
    }

    return catchDiv;
}


// updating the output sections of the page with the given data
function updateFilter() {

    for (let type of ['fish', 'bugs']) {
        var output = document.getElementById(type);
        output.innerHTML = '';

        for (let [index, row] of Object.entries(catches[type])) {
            let monthSelection = $("input[name='month']:checked").val();

            if (row[monthSelection] || monthSelection == 'all') {
                output.appendChild(createCatch(index, row));
            }
        }
    }
}


// use jquery and ajax to query the server and get a response
function getData() {
    console.log("getting data...");

    // this is the actual query to the server
    $.getJSON(
        // location of url we want to contact
        $SCRIPT_ROOT + '/_get_data', 
        
        // json to pass into that url
        // getting the checked property for the month radio widget
        {
            month:$("input[name='month']:checked").val()
        },

        // on success, this function is called
        function(data) {
            catches['fish'] = data['fish'];
            catches['bugs'] = data['bugs'];
            updateFilter();
        }
    )
}


// poputlating the data when the page loads
getData();

// when the month radio buttons are changed, we want to run all the backend ajax stuff
$("input[name='month']").change(updateFilter);

$(`#${MONTHS[MONTH_NUM]}`).click()
