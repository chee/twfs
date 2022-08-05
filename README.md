# twfs

a fuse filesystem for tweets

## installation

you're going to need FUSE[^1] installed, and any fuse -devel packages if
you're using a distro that splits those out (Void, Fedora and Debian
do).

i've included node@10 in the dev-dependencies, it works with that.

open a terminal and run these commands:

``` bash
$ git clone https://github.com/chee/twfs.git
$ cd twfs
$ npm install
```

hopefully that worked.

now create a working copy of the config:

``` bash
$ cp config.example.json config.json
```

now open that in a text editor. if you opened a fresh terminal, the
`twfs` folder should be in your home directory `:)`

the keys and secrets to go in those variables can be retrieved when
you've [created an
app](https://developer.twitter.com/en/portal/apps/new)[^2], go to its
"keys and tokens" page. the "consumer" key and secret are called "API
Key & Secret" in Twitter's web ui, and the access token & secret

now you can run

``` bash
$ npx node index.js
```

and it will mount a file system at \~\~./twitter\~. if you run
`cat twitter/username` it will print username's latest tweet.

# Footnotes

[^1]: [FUSE](https://github.com/libfuse/libfuse/) on linux,
    [OSXFuse](https://osxfuse.github.io/) on macOS and
    [Dokany](https://github.com/dokan-dev/dokany/releases) on Windows

[^2]: i'm not sure the exact steps, i'm using an app i made a long time
    ago
