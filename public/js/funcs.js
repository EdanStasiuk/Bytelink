// When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size
window.onscroll = function() { scrollFunction() };

function scrollFunction()
{
  if (document.body.scrollTop > 60 || document.documentElement.scrollTop > 60) // small navbar
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
function isValidTrackingCode(string)
{
  const list = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  
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
 * Checks if string is a valid URL
 * Returns a bool
 */
function isValidUrl(string)
{
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "ftp://";
}

/**
 * Check if user enters a valid input, opens model if so.
 * If user enters URL, then update firestore 'urls' collection
 * else if user enters tracking code, then get info from firestore
 * 
 * Redirects to ./logs.html
 */
function checkModel(event) {
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
      return false;
  }
  // User enters invalid input
  else if ((event.keyCode === 13) == true && 
  ((isValidUrl(document.querySelector('.user-input').value) && 
  isValidTrackingCode(document.querySelector('.user-input').value)) == false))
  {
    // TO DO: Add a bubble to show user what input is required of them, like "requires a valid url"
    alert("Enter a valid URL or tracking code");
    event.preventDefault();
  }
}

var myBlurFunction = function(state)
{
  /* state can be 1 or 0 */
  var containerElement = document.getElementById('main-container');
  var overlayEle = document.getElementById('overlay');

  if (state) {
      overlayEle.style.display = 'block';
      containerElement.setAttribute('class', 'blur');
  } else {
      overlayEle.style.display = 'none';
      containerElement.setAttribute('class', null);
  }
};