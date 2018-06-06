config = require('./config.json')
twitter = new (require('twitter'))(config)
fuse = require('fuse-bindings')
randomItem = require('random-item')
Array.prototype.random = function () {
  return randomItem(this)
}

isroot = path => path === '/'
notroot = path => !isroot(path)

path = 'twitter'

makenode = (options = {}) => Object.assign({}, {
  mtime: new Date,
  atime: new Date,
  ctime: new Date,
  nlink: 1,
  size: 280,
  mode: 33188,
  uid: process.getuid ? process.getuid() : 0,
  gid: process.getgid ? process.getgid() : 0
}, options)

fuse.mount(path, {
  options: ['direct_io'],
  readdir (path, done) {
    console.log(`readdir(${path})`)
    if (notroot(path)) return done(0)
    return done(0, ['hello'])
  },

  getattr (path, done) {
    if (isroot(path)) {
      return done(0, makenode({
        nlink: 1,
        size: 100,
        mode: 16877
      }))
    }

    done(0, makenode())
  },

  open (path, flags, done) {
    console.log(`open(${path}, ${flags})`)
    done(0, 42)
  },

  read (path, fd, buffer, length, position, done) {
    console.log({path, fd, length, position}, 'read')
    if (path.startsWith('/.')) return done(0)
    let screen_name = path.slice(1)
    twitter.get('statuses/user_timeline', {screen_name}, (error, tweets) => {
      if (error) {
        return console.log(error, done(0))
      }
      tweet = tweets.random().text
      string = tweet.slice(position, position + length)
      if (string == tweet || !string) {
        tweet = ''
      }

      console.log({string, tweet, position, length}, 'in twitter cb')

      if (!string) {
        return done(0)
      }

      buffer.write(string)
      done(string.length)
    })
  }
}, error => {
  if (error) {
    unmount()
    throw error
  }
  console.log(`mounted at ${path} mate`)
})

unmount = () => {
  fuse.unmount(path, error =>
    error
      ? console.log(`mate i couldn't unmount ${path}`, error)
      : console.log(`lol mate ${path} is gonzo`)
  )
}

process.on('SIGINT', unmount)
