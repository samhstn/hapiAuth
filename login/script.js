const handleClick = () => {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 200) {
      parseInt(xhr.responseText) ? window.location.href = '/' :
        document.getElementById('response').innerHTML = 'incorrect login details'
    }
  }
  xhr.open('post', '/login')
  xhr.send(JSON.stringify({
    username: username,
    password: password
  }))
}

document.getElementById('button').addEventListener('click', handleClick)

