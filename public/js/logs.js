import { db } from "./firebase.js"
import { collection,
        query,
        where,
        getDocs 
        } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"

// Create a reference to the urls collection
const urlsRef = collection(db, "urls");

// Get tracking code from local storage
var trackingCode = localStorage.getItem('trackingCode');

// Create a query against the collection
const q1 = query(urlsRef, where("tracking_code", "==", trackingCode));

const querySnapshot1 = await getDocs(q1);
querySnapshot1.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());

    /* NOTE: Switch short-url to localhost for testing;
     *  had to hardcode the url because the browser treats the resultant url 
     *  as insecure for some reason. */
    // https://bytelink-ipg.web.app/redirect.html?
    // http://localhost:3000/redirect.html?

    // Insert info from firestore to logs table
    document.getElementById("long-url").innerHTML = doc.data().long_url;
    document.getElementById("short-url").innerHTML = "https://bytelink-ipg.web.app/redirect.html?" + doc.data().short_code;
    document.getElementById("tracking-code").innerHTML = doc.data().tracking_code;
    document.getElementById("access-link").innerHTML = window.location.href;

    // Save the document ID to local storage to access it in querySnapshot2
    localStorage.setItem('docID', doc.id);
});

var docID = localStorage.getItem('docID');
const querySnapshot2 = await getDocs(collection(db, "urls", docID, "clicks"));
querySnapshot2.forEach((doc) => {
    addItemToTable(doc.data().city, doc.data().region, doc.data().country, doc.data().flag, 
        doc.data().continent, doc.data().ipAddress, doc.data().isp, doc.data().time, doc.data().date);
})

function addItemToTable(city, region, country, flag, continent, ipAddress, isp, time, date) {
    var trow = document.createElement('tr');

    var cellValues = [
        date + " " + time,
        ipAddress,
        city + ", " + region + ", " + country + " " + flag + ", " + continent,
        "N/A",
        "N/A",
        "N/A",
        isp
    ];

    // Create and append cell elements to the row
    for (var i = 0; i < cellValues.length; i++) {
        var td = document.createElement('td');
        td.innerHTML = cellValues[i];
        trow.appendChild(td);
    }

    // Append the row to the table body in logs.html
    document.getElementById('tbody1').appendChild(trow);
}