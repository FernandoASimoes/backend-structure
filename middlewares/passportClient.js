const passport = require('passport');
const passportJwt = require('passport-jwt');
const { Strategy, ExtractJwt } = passportJwt;

module.exports = app => {
  const params = {
    secretOrKeyProvider: async (req, rawJwtToken, done) => {
      try {
        const JWT_CLIENT_AUTH_SECRET = await app.models.system.parameters.get(
          app.constants.system.parameters.JWT_CLIENT_AUTH_SECRET
        );
        done(null, JWT_CLIENT_AUTH_SECRET);
      } catch (err) {
        done(err, null);
      }
    },
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    passReqToCallback: true
  };

  const strategy = new Strategy(params, async (req, payload, done) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const data = await app.db
        .select({ id: 'system_clients.id' })
        .from(app.constants.db.TABLE.SYSTEM_CLIENTS)
        // .where('system_clients.id', payload._id) // opcional, se quiser validar id do payload
        .andWhere('system_clients.auth_token', token)
        .first();

      if (data) {
        done(null, {
          systemClientId: payload._id,
          req: app.utils.format.request(req)
        });
      } else {
        app.models.system.logs.insert(
          { req: app.utils.format.request(req) },
          { functionName: 'passportClient', payload },
          false
        ).catch(() => {});
        done(null, false);
      }
    } catch (err) {
      app.models.system.logs.insert(
        { req: app.utils.format.request(req) },
        { functionName: 'passportClient', payload, err: err.message },
        false
      ).catch(() => {});
      done(err, false);
    }
  });

  passport.use('client-auth', strategy);

  return {
    initialize: () => passport.initialize(),
    auth: () => passport.authenticate('client-auth', { session: false })
  };
};
