import { db } from "./firebase.js"
import { collection, 
        addDoc,
        query,
        where,
        getDocs 
        } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"

/* Generate random tracking code of length 6 with no O or 0 */
function rand_str_without_O0() {
    const list = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
    var res = "";
    for (var i = 0; i < 6; i++) {
        var rnd = Math.floor(Math.random() * list.length);
        res = res + list.charAt(rnd);
    }

    return res;
}

/* Adds inputted long URL and a code into firestore database 'urls' collection */
const submit = document.querySelector('.submit-form');


if (submit !== undefined && submit !== null) {
    submit.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // get whether user inputted a url or tracking code (from checkModel(event))
        const userInput = document.querySelector('.user-input').value;
        var inputType = localStorage.getItem('user_input');

        // User inputted a url
        if (inputType === 'url') {

            // Generate tracking code and save it to local storage
            var trackingCode = rand_str_without_O0();
            localStorage.setItem('trackingCode', trackingCode);

            // Check whether the tracking code already exists and generate a new one if so
            var cont = true;
            while (cont) {
                var ref = collection(db, "urls");
                var q = query(ref, where("tracking_code", "==", trackingCode));
                
                var querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    // console.log(querySnapshot.empty);
                    cont = false;
                }

                else {
                    trackingCode = rand_str_without_O0();
                    localStorage.setItem('trackingCode', trackingCode);
                }
            }

            // Generate a second code
            var shortCode = rand_str_without_O0();

            // Check whether the short code already exists and generate a new one if so
            cont = true;
            while (cont) {
                var ref = collection(db, "urls");
                var q = query(ref, where("short_code", "==", shortCode));
                
                var querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    // console.log(querySnapshot.empty);
                    cont = false;
                }

                else {
                    shortCode = rand_str_without_O0();
                }
            }

            // Add doc to urls collection
            const docRef = await addDoc(collection(db, "urls"), {
                long_url: userInput,
                tracking_code: trackingCode,
                short_code: shortCode,
            });

            console.log("Document written with ID: ", docRef.id);
            window.location.href="./logs.html";
        }

        // User inputted a tracking code
        else {

            // Create a reference to the urls collection
            const urlsRef = collection(db, "urls");

            // Create a query against the collection
            const q = query(urlsRef, where("tracking_code", "==", userInput));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                
                const trackingCode = doc.data().tracking_code;
                localStorage.setItem('trackingCode', trackingCode);
            })

            window.location.href="./logs.html";
        }
    })
}