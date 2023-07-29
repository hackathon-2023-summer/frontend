window.onload = function () {
  const form = document.querySelector('form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.querySelector('input[name="username"]').value;
    fetch(`http://localhost:80/api/users/${username}`, {
      method: 'POST'
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  });
};