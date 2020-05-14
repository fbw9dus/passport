
const passport     = require('passport');
const { Strategy } = require('passport-local');
const { User }     = require('../model/User');

// const u = new User({
//   authId: "anx@local",
//   displayName: 'anx',
//   password: 'passwort1'
// });
// u.save()

const StrategyInstance = new Strategy( async ( username, password, done )=> {
  const authId = `${username}@local`;
  let user = await User.findOne({authId});
  if ( user && user.password === password )
    return done( null, user );
  else     done( 404 );
});

const filterProfile = (profile)=> ({ ...profile, provider:'local' })

const Routes = (app)=> {
  app.get('/register', async (req,res,next)=>{
    const authId = req.body.username + '@local';
    let user = User.findOne({authId});
    if ( user ) res.status(401).json({error:'unauthorized'})
    user = new User({ authId, ...req.body });
    await user.save()
    res.json(user);
  });
}

module.exports = { StrategyInstance, Routes, filterProfile }
