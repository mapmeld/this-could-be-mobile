# This could be mobile...

## ... but you playing

It's a way to demo what someone else's site would look like
if they added a mobile-responsive CSS file.

Recently I've found a lot of sites which would be good to have on my phone, but they
didn't invest in mobile-responsive CSS. If they're not on GitHub, it's tricky to write to them
and say "hey, add this file to your website." So I made a website that demos what it does,
with instructions about how to add it.

## Setup

Prerequisites: git, MongoDB, NodeJS, a Heroku account

```bash
git clone https://github.com/mapmeld/this-could-be-mobile.git
cd this-could-be-mobile
mongod &
npm install
npm start

heroku create my-mobile-recommend
heroku addons:add mongolab:sandbox --app my-mobile-recommend
git push heroku master
```

## License

Open source, MIT license
