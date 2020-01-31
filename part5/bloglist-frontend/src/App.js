import React, { useState, useEffect } from 'react';
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
 
  useEffect(() => {
    blogService.getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])

  const blogsToShow = () => blogs.map(blog =>
    <Blog key={blog.id} blog={blog} />
  )


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong Credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username: 
        <input type="text"
          value={username}
          name="Username"
          onChange={({target}) => setUsername(target.value) } />
        
      </div>
      <div>
        password: 
        <input type="password"
          value={password}
          name="Password"
          onChange={({target}) => setPassword(target.value) } />
      </div>
      <button type="submit"> Login </button> 
    </form>
  )


  return (
    <div>
      <h1> Blog Application </h1>

      <Notification message={errorMessage} />

      { user === null ?
          <div>
            <h2> Log in to application </h2>
            { loginForm() }
          </div> :
          <div>
            <h2> Blogs </h2>
            {  blogsToShow() }
          </div>

      }

    </div>
  )
}

export default App;
