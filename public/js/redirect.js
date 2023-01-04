import { db } from "./firebase.js"
import { collection,
    query,
    where,
    getDocs,
    addDoc,
    } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"

/**
 * Used for printing the IP address; for testing
 */
function printIP(data) {
    // Find ip-address key-value pair 
    var ipAddress = data.ip_address;

    console.log("IP address: " + ipAddress);
    document.getElementById("ip").innerHTML = ipAddress;
}

/**
 * Returns the 6 digit code in the URL that is used 
 *  to redirect to the target website
 */
function getParam() {
    const urlString = window.location.href; 
    let paramString = urlString.split("?");
    console.log("param is: " + paramString[1]);
    
    return paramString[1];
}

/**
 * Stores all relevant IP information in Firestore
 */
async function storeIP(data) {

    // Create a reference to the urls collection
    const urlsRef = collection(db, "urls");

    // Create a query against the collection
    const q = query(urlsRef, where("short_code", "==", getParam()));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        
        // Add doc to clicks collection
        addDoc(collection(db, "urls", doc.id, "clicks"), {
        ipAddress: data.ip_address,
        city: data.city,
        region: data.region_iso_code,
        country: data.country,
        continent: data.continent,
        flag: data.flag.emoji,
        time: data.timezone.current_time,
        isp: data.connection.isp_name
        });

        console.log("Document written with ID: ", doc.id);
        console.log(doc.id, " => ", doc.data());
        setTimeout(() => { // Need this otherwise the data grab is inconsistent; page changes too quickly I'm guessing
            window.location.href = doc.data().long_url;
        }, 1000);
    })
}

/**
  * Gets all local IP related info to be displayed
  *   and uses storeIP(data) to store in Firestore
  */
document.onload = function getIP() {
    var url = "https://ipgeolocation.abstractapi.com/v1/?api_key=02372566092b494db1e1497863293b02";

    fetch(url)
    // Get the JSON data
    .then(response => response.json())
    // Use the JSON data
    // .then(data => printIP(data))
    // Store relevant data
    .then(data => storeIP(data));
}