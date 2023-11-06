/**
 * TODO: Get this working, logically the function is fine, issue is with script types in index.html
 * Not urgent, no real risk of breaking the app but would be better with this implemented
 */
/**
 * Checks if string is a tracking code
 * Returns a bool
 * Queries database to see if the string exists instead of just checking the format
 */
async function trackingCodeInDb(trackingCode) {
    const ref = collection(db, "urls");
    const q = query(ref, where("tracking_code", "==", trackingCode));
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      alert("Sorry, this is not a valid tracking code!");
      return false;
    }
  
    else {
      return true;
    }
}