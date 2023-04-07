function login(){
  var emailvar=document.getElementById('email').value
  var passwordvar=document.getElementById('password').value

    const url = 'http://localhost:3000/auth/login'

    // const customHeaders = {
    //    "Content-Type": "application/json",
    //     "Access-Control-Allow-Origin": "http://localhost:5502",
    //     "Access-Control-Allow-Credentials": "true"
    // }

    fetch(url, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: emailvar,
        password: passwordvar,
      }),
      credentials: 'include'
        
      })
    .then(response => {
        // handle the response
        console.log(response.json());
        var rheader = document.getElementById('resultheader');
        if (response.status == 401)
          rheader.innerHTML = "Login Failed"
        else {
          rheader.innerHTML = "Login Successful"
          window.location.assign('http://localhost:3000/dashboard.html')
        }
    })
    .catch(error => {
      console.error(error); // handle the error
      var rheader = document.getElementById('resultheader');
      if (response.status == 401)
        rheader.innerHTML = "Login Failed"
    });
}
function newsignup(){
  var emailvar=document.getElementById('email').value
  var passwordvar=document.getElementById('password').value

    const url = 'http://localhost:3000/auth/create'

    // const customHeaders = {
    //    "Content-Type": "application/json",
    //     "Access-Control-Allow-Origin": "http://localhost:5502",
    //     "Access-Control-Allow-Credentials": "true"
    // }

    fetch(url, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: emailvar,
        password: passwordvar,
      }),
      credentials: 'include'
        
      })
    .then(response => {
        // handle the response
        console.log(response.json());
        var rheader = document.getElementById('resultheader');
        if(response.status == 409)
          rheader.innerHTML = "User already exists. Please login";
        else
          rheader.innerHTML = "User created successfully. Please login"
    })
    .catch(error => {
      console.error(error); // handle the error
    });

   
}

function newQuote(){
  const quoteurl = "https://api.quotable.io/random";
 
  fetch(quoteurl)
      // ✅ call response.json() here
      .then(response => response.json())
      .then(data => {
        var quoteheaderelement = document.getElementById("quoteheader");
        quoteheaderelement.innerHTML = data.content;
      
      })
      .catch(err => {
        console.log(err);
      })


}
newQuote();