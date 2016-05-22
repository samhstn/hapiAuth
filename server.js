const Hapi = require('hapi')
require('env2')('./config.env')

const server = new Hapi.Server()
const port = process.env.PORT || 3000

const Cookie = process.env.COOKIE

server.connection({ port })

server.state('cookie', {
  ttl: 60 * 1000,
  isHttpOnly: true,
  encoding: 'iron',
  password: process.env.IRONPASSWORD
})

server.register(require('inert'), err => {
  if(err) throw err
  server.route([
    {
      method: 'get',
      path: '/login',
      handler: (request, reply) => {
        request.state.cookie === Cookie ?
          reply.redirect('/') :
            reply.file('./login/index.html')
      }
    },
    {
      method: 'get',
      path: '/login/{filename}',
      handler: (request, reply) => {
        reply.file('./login/' + request.params.filename)
      }
    },
    {
      method: 'post',
      path: '/login',
      config: {
        handler: (request, reply) => {
          const user = {
            username: process.env.USERNAME,
            password: process.env.PASSWORD
          }
          const parsedRequest = JSON.parse(request.payload)
          const username = parsedRequest.username
          const password = parsedRequest.password
          username === user.username && password === user.password ?
            reply(1).state('cookie', Cookie) : reply(0)
        }
      }
    },
    {
      method: 'get',
      path: '/',
      handler: (request, reply) => {
        request.state.cookie === Cookie ?
          reply.file('./public/index.html') :
            reply.redirect('/login')
      }
    },
    {
      method: 'get',
      path: '/public/{filename}',
      handler: (request, reply) => {
        request.state.cookie === Cookie ?
          reply.file('./public/' + request.params.filename) :
            reply.redirect('/login')
      }
    },
    {
      method: 'get',
      path: '/logout',
      handler: (request, reply) => {
        console.log('logging out')
        reply('clearing cookie').state('cookie', null, {ttl: 0})
      }
    }
  ])
})

server.start(err => {
  if(err) throw err
  console.log('server running on: ', server.info.uri)
})

