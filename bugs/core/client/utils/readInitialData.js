let initialData = null;

function readInitialData() {
    if (!initialData) {
        initialData = JSON.parse(document.getElementById('initial-data').innerText);
    }

    return initialData;
}

export {
    readInitialData
}