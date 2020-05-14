/*
██████   █████  ███████ ███████ ██████   ██████  ██████  ████████
██   ██ ██   ██ ██      ██      ██   ██ ██    ██ ██   ██    ██
██████  ███████ ███████ ███████ ██████  ██    ██ ██████     ██
██      ██   ██      ██      ██ ██      ██    ██ ██   ██    ██
██      ██   ██ ███████ ███████ ██       ██████  ██   ██    ██
*/

module.exports = function(app){

  const { JWT_SECRET, BACKEND_PORT, DB } = process.env;
  const passport     = require('passport');
  const jwt          = require('jsonwebtoken');
  const { User }     = require('../model/User');

  // passport braucht eine middleware bei express
  const passportMiddleware = passport.initialize();
  app.use( passportMiddleware );

  // app.get(`/auth/check`, (req,res)=>{});

  passport.serializeUser(         ( user,   done )=> done( null, user.authId )    );
  passport.deserializeUser( async ( authId, done )=> await User.findOne({authId}) );

  const databaseConnector = (filterProfile)=> async ( accessToken, refreshToken, profile, done )=> {
    // sucht benutzer in der datenbank oder legt einen neuen an
    // console.log(profile);
    const { displayName, imageURL, id, provider } = filterProfile(profile);
    const authId = `${id}@${provider}`
    let user = await User.findOne({authId});
    if ( ! user ){
      user = new User({
        authId,
        displayName,
        imageURL,
        authData: { accessToken, refreshToken },
      });
      await user.save();
    }
    done( null, user );
  }

  const providers = ['github','local'];

  providers.forEach( ( provider )=>{
    let {
      Strategy, Config, filterProfile, StrategyInstance, Routes
    } = require( './' + provider );

    StrategyInstance = StrategyInstance || new Strategy(
      { ...Config,
        callbackURL: `http://localhost:3001/auth/${provider}/callback`
      },
      databaseConnector(filterProfile)
    );

    passport.use( provider, StrategyInstance );

    if ( Routes ) Routes( app );
    else app.get(`/auth/${provider}`, passport.authenticate( provider ) );

    app.get(`/auth/${provider}/callback`,
      passport.authenticate( provider ),
      ( req, res )=> {
        const { id, displayName } = req.user;
        const token = jwt.sign({id,displayName},JWT_SECRET);
        res.redirect('http://localhost:3000/token/' + token);
      }
    );

  });
}
