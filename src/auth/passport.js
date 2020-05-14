/*
██████   █████  ███████ ███████ ██████   ██████  ██████  ████████
██   ██ ██   ██ ██      ██      ██   ██ ██    ██ ██   ██    ██
██████  ███████ ███████ ███████ ██████  ██    ██ ██████     ██
██      ██   ██      ██      ██ ██      ██    ██ ██   ██    ██
██      ██   ██ ███████ ███████ ██       ██████  ██   ██    ██
*/

module.exports = function(app){

  const { JWT_SECRET, BACKEND_PORT, DB, GITHUB_CLIENT, GITHUB_SECRET } = process.env;
  const passport     = require('passport');
  const jwt          = require('jsonwebtoken');
  const { Strategy } = require('passport-github');
  const { User }     = require('../model/User');

  // passport braucht eine middleware bei express
  const passportMiddleware = passport.initialize();
  app.use( passportMiddleware );

  // app.get(`/auth/check`, (req,res)=>{});

  passport.serializeUser(         ( user,   done )=> done( null, user.authId )    );
  passport.deserializeUser( async ( authId, done )=> await User.findOne({authId}) );

  const databaseConnector = async ( accessToken, refreshToken, profile, done )=> {
    // sucht benutzer in der datenbank oder legt einen neuen an
    // console.log(profile);
    const authId = `${profile.id}@${profile.provider}`
    let user = await User.findOne({authId});
    if ( ! user ){
      user = new User({
        authId,
        authData: { accessToken, refreshToken },
        displayName: profile.displayName,
        imageURL:    profile.photos[0].value,
      });
      await user.save();
    }
    done( null, user );
  }

  const Config = {
    clientID:     GITHUB_CLIENT,
    clientSecret: GITHUB_SECRET,
    callbackURL: 'http://localhost:3001/auth/github/callback'
  };

  const StrategyInstance = new Strategy( Config, databaseConnector );

  passport.use( 'github', StrategyInstance );

  app.get(`/auth/github`, passport.authenticate('github') );

  app.get(`/auth/github/callback`,
    passport.authenticate('github'),
    ( req, res )=> {
      const { id, name, email } = req.user;
      const token = jwt.sign({id,name,email},JWT_SECRET);
      res.redirect('http://localhost:3000/token/' + token);
    }
  );
}
