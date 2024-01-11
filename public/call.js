// Sample JSON data
const jsonData = JSON.parse(tableDataJson);
const prettyClasses = {
    th: 'bg-gray-300',
    thFont: 'text-xl',
    cellText: 'text-gray-800',
    cellFont: 'text-lg',
    telLink: 'text-blue-500'
};
const table = document.getElementById('data-table');

// Function to render JSON data in the table
function renderTable(data) {
    // url is like /table/:id get the ID
    const url = window.location.href;
    const tableID = url.split('/')[4];
    table.innerHTML = ''; // Clear the table

    // Sort data alphabetically by 'Name' property
    data.sort((a, b) => a.Name.localeCompare(b.City));

    // Create table headers
    const headerRow = table.insertRow();
    const checkboxHeader = document.createElement('th');
    checkboxHeader.classList.add(prettyClasses.th);
    checkboxHeader.textContent = 'Called';
    headerRow.appendChild(checkboxHeader);

    Object.keys(data[0]).forEach(key => {
        const headerCell = document.createElement('th');
        headerCell.classList.add(prettyClasses.th);
        headerCell.classList.add(prettyClasses.thFont);
        headerCell.textContent = key;
        headerRow.appendChild(headerCell);
    });

    // Populate table rows with JSON data and add checkboxes
    data.forEach(item => {
        const row = table.insertRow();
        const checkboxCell = row.insertCell();
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = localStorage.getItem(item.Name + '-' + tableID) === 'true'; // Set checkbox state from localStorage
        checkbox.addEventListener('change', () => {
            localStorage.setItem(item.Name + '-' + tableID, checkbox.checked); // Save checkbox state to localStorage
            localStorage.setItem('list-' + tableID, JSON.stringify({
                url: tableID,
                name: JSON.parse(localStorage.getItem('list-' + tableID)).name,
                date: JSON.parse(localStorage.getItem('list-' + tableID)).date,
                lastUsed: new Date(),
                notes: JSON.parse(localStorage.getItem('list-' + tableID)).notes,
                contactCount: jsonData.length,
                called: JSON.parse(localStorage.getItem('list-' + tableID)).called + (checkbox.checked ? 1 : -1),
            }));

            renderTable(data); // Re-render the table to reorder the rows based on 'Name' and checkbox state
            allChecked();
        });
        checkboxCell.appendChild(checkbox);

        Object.keys(item).forEach(key => {
            const cell = row.insertCell();
            cell.classList.add(prettyClasses.cellText);
            cell.classList.add(prettyClasses.cellFont);
            if (key === 'Phone') {
                // For 'Phone' key, remove non-numeric characters and create tel: link
                const phoneNumber = item[key].replace(/\D/g, ''); // Remove non-numeric characters
                const telLink = document.createElement('a');
                telLink.classList.add(prettyClasses.telLink);
                telLink.href = `tel:${phoneNumber}`;
                telLink.textContent = phoneNumber;
                cell.appendChild(telLink);
            } else {
                cell.textContent = item[key];
            }
        });
    });

    // Move checked items to the bottom
    const checkedRows = Array.from(table.rows).filter(row => {
        const checkbox = row.cells[0].querySelector('input[type="checkbox"]');
        return checkbox && checkbox.checked;
    });
    checkedRows.forEach(row => table.appendChild(row));
}


// Initial rendering of the table
renderTable(jsonData);

// url is like /table/:id get the ID
const currentUrl = window.location.href;
const urlToSave = currentUrl.split('/')[4];
// save to local storage with json like {url: {name: '', date:'', notes:''}} unless it already exists
const windowStorage = window.localStorage;
const storedData = windowStorage.getItem('list-' + urlToSave);
if (!storedData) {
    windowStorage.setItem('list-' + urlToSave, JSON.stringify({
        url: urlToSave,
        name: 'Name This List',
        date: new Date(),
        lastUsed: new Date(),
        notes: 'Add some notes!',
        contactCount: jsonData.length,
        called: 0
    }));
}
const tableTitle = document.getElementById('table-title');
tableTitle.innerHTML = JSON.parse(storedData).name;

function addConfetti() {
    // <script src="https://cdn.jsdelivr.net/npm/tsparticles-confetti@2.12.0/tsparticles.confetti.bundle.min.js"></script>
    // confetti({
    //     particleCount: 100,
    //     spread: 70,
    //     origin: { y: 0.6 },
    // });
    const confettiScript = document.createElement('script');
    confettiScript.src = 'https://cdn.jsdelivr.net/npm/tsparticles-confetti@2.12.0/tsparticles.confetti.bundle.min.js';
    document.body.appendChild(confettiScript);
    confettiScript.onload = function () {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });
    };
}

function allChecked() {
    const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    if (checkboxes.every(checkbox => checkbox.checked)) {
        addConfetti();
    }
}

var initOpts = {
    projectKey: 'IKcV8t0dGgwrDci835Qc',
    defaultInputMode: 0,
    obscureTextNumbers: false,
    obscureTextEmails: false,
};
(function (A, s, a, y, e, r) {
    r = window.OpenReplay = [e, r, y, [s - 1, e]];
    s = document.createElement('script');
    s.src = A;
    s.async = !a;
    document.getElementsByTagName('head')[0].appendChild(s);
    r.start = function (v) {
        r.push([0]);
    };
    r.stop = function (v) {
        r.push([1]);
    };
    r.setUserID = function (id) {
        r.push([2, id]);
    };
    r.setUserAnonymousID = function (id) {
        r.push([3, id]);
    };
    r.setMetadata = function (k, v) {
        r.push([4, k, v]);
    };
    r.event = function (k, p, i) {
        r.push([5, k, p, i]);
    };
    r.issue = function (k, p) {
        r.push([6, k, p]);
    };
    r.isActive = function () {
        return false;
    };
    r.getSessionToken = function () { };
})(
    '//static.openreplay.com/latest/openreplay-assist.js',
    1,
    0,
    initOpts
);