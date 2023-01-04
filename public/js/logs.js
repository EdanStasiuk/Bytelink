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

    /* Switch short-url to localhost for testing;
     *  had to hardcode the url because the browser treats the resultant url 
     *  as insecure for some reason. */
    // https://bytelink-ip.web.app/redirect.html?
    // http://localhost:3000/redirect.html?

    // Insert info from firestore to logs table
    document.getElementById("long-url").innerHTML = doc.data().long_url;
    document.getElementById("short-url").innerHTML = "http://localhost:3000/redirect.html?" + doc.data().short_code;
    document.getElementById("tracking-code").innerHTML = doc.data().tracking_code;
    document.getElementById("access-link").innerHTML = window.location.href;

    // Save the document ID to local storage to access it in querySnapshot2
    localStorage.setItem('docID', doc.id);
});

var docID = localStorage.getItem('docID');
const querySnapshot2 = await getDocs(collection(db, "urls", docID, "clicks"));
querySnapshot2.forEach((doc) => {
    addItemToTable(doc.data().city, doc.data().region, doc.data().country, doc.data().flag, 
        doc.data().continent, doc.data().ipAddress, doc.data().isp, doc.data().time);
})

function addItemToTable(city, region, country, flag, continent, ipAddress, isp, time) {
    
    // Create variables for elements of new row
    var trow = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    var td6 = document.createElement('td');
    var td7 = document.createElement('td');

    // Assign values to variables
    td1.innerHTML = time;
    td2.innerHTML = ipAddress;
    td3.innerHTML = city + ", " + region + ", " + country + " " + flag + ", " + continent;
    td4.innerHTML = "temp undefined";
    td5.innerHTML = "temp undefined";
    td6.innerHTML = "temp undefined";
    td6.innerHTML = "temp undefined";
    td7.innerHTML = isp;

    // Append row to table body in logs.html
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    trow.appendChild(td6);
    trow.appendChild(td7);
    document.getElementById('tbody1').appendChild(trow);
}