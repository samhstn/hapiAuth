console.log('finding the public script file')

const logout = () => {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 200) {
      console.log('response text: ', xhr.responseText)
      window.location.href = '/login'
    }
  }
  xhr.open('get', '/logout')
  xhr.send()
}

document.getElementById('logout').addEventListener('click', logout)

