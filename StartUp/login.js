
function newsignup(){
  var emailvar=document.getElementById('email').value
  var passwordvar=document.getElementById('password').value

    const url = 'http://localhost:8080/auth/create'

    const customHeaders = {
        "Content-Type": "application/json",
    }

    fetch(url, {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify({
          email: emailvar,
          password: passwordvar,
        })
          
    })
        .then((response) => response.json())
        .then((body) => {
            console.log(body);
            resultheader = document.getElementById('resultheader');
            resultheader.innerHTML = data.title;

            
        })
        .catch((error) => {
            console.error(error);
            
        });
}
