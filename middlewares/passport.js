const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = app => {
  const userModule = require('../models/user/main.js')(app);

  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await userModule.get({ email: username, checkPassword: true });
        if (!user) return done(null, false, { message: 'Usuário não encontrado' });

        const match = await app.utils.bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: 'Senha incorreta' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModule.get({ userId: id });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  return passport;
};
