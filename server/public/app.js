window.onload = function () {
  const form = document.querySelector('form');
  form.addEventListener('submit', function (event) {
    console.log("click")
    event.preventDefault();
    const username = document.querySelector('input[name="username"]').value;
    //fetch(`http://localhost:80/api/users/${username}`, {
    fetch(`${window.API_BASE_URL}/api/users/${username}`, {
      method: 'POST'
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  });
};