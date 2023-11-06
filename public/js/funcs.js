/**
 * When the user scrolls down 80px from the top of the document,
 *   resize the navbar's padding and the logo's font size.
 */
window.onscroll = function() { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 60 || document.documentElement.scrollTop > 60) //small navbar
  {
    document.getElementById("navbar").style.padding = "10px 10px";
    document.getElementById("logo").style.fontSize = "45px";
    document.getElementById("navbar-right").style.fontSize = "35px";
  }
  
  else // big navbar
  {
    document.getElementById("navbar").style.padding = "40px 10px";
    document.getElementById("logo").style.fontSize = "75px";
    document.getElementById("navbar-right").style.fontSize = "18px";
  }
}

/**
 * Checks if string is a tracking code
 * Returns a bool
 */
function isValidTrackingCode(string) {
  const list = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  
  string = string.trim(); // remove white space surrounding string

  if (string.length != 6)
  {
    return false;
  }

  for (var i = 0; i < 6; i++)
  {
    if (!list.includes(string[i]))
    {
      return false;
    }
  }

  return true;
}

/**
 * TODO: Get this working, logically the function is fine, issue is with script types in index.html
 * Not urgent, no real risk of breaking the app but would be better with this implemented
 */
/**
 * Checks if string is a tracking code
 * Returns a bool
 * Queries database to see if the string exists instead of just checking the format
 */
// async function trackingCodeInDb(trackingCode) {
//   const ref = collection(db, "urls");
//   const q = query(ref, where("tracking_code", "==", trackingCode));
  
//   const querySnapshot = await getDocs(q);
//   if (querySnapshot.empty) {
//     alert("Sorry, this is not a valid tracking code!");
//     return false;
//   }

//   else {
//     return true;
//   }
// }

/**
 * Checks if string is a valid URL
 * Returns a bool
 */
function isValidUrl(string) {
  try { return Boolean(new URL(string)); }
  catch(e) { return false; }
}

/**
 * Check if user enters a valid input, opens modal if so.
 * If user enters URL, then update firestore 'urls' collection
 * else if user enters tracking code, then get info from firestore
 * 
 * Page is then redirected to ./logs.html
 */
function checkModal(event) {
  // User enters valid input
  if (event.keyCode === 13 && 
    (isValidUrl(document.querySelector('.user-input').value) || 
    isValidTrackingCode(document.querySelector('.user-input').value))) {
      
      // User inputted a URL
      if (isValidUrl(document.querySelector('.user-input').value))
      {
        localStorage.setItem('user_input', 'url');
      } 

      // User inputted a tracking code
      else 
      {
        localStorage.setItem('user_input', 'tracking_code');
      }
      
      event.preventDefault();
      $('#modal').modal();
      return true;
  }
  
  // User enters invalid input
  else if ((event.keyCode === 13) && 
  ((isValidUrl(document.querySelector('.user-input').value) && 
  isValidTrackingCode(document.querySelector('.user-input').value)) == false)) {
    alert("Enter a valid URL or tracking code");
    event.preventDefault();
    return false;
  }

  return undefined;
}

module.exports = {
  isValidTrackingCode,
  isValidUrl,
  checkModal,
};