const re_mail =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export function ValidateEmail(email) {
  if (email.match(re_mail)) {
    return true;
  }
  return false;
}


const re_valid_Chars = /^[a-zA-Z0-9_\s&]+$/

  export function validate_valid_chars(text){
    if(text.match(re_valid_Chars)){
      return true;
    }
    return false;
  }


export function copyTextToClipboad(text) {
  // Get the text field
   // Copy the text inside the text field
  navigator.clipboard.writeText(text);

  // Alert the copied text
  alert("Copied the text: " + text);
} 
