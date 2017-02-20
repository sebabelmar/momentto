'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    InstagramStrategy = require('passport-instagram').Strategy,
    users = require('../../controllers/users.server.controller');

module.exports = function(config) {
	// Use instagram strategy
	passport.use(new InstagramStrategy({
			clientID: config.instagram.clientID,
			clientSecret: config.instagram.clientSecret,
			callbackURL: config.instagram.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json.data;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			console.log('XXXXXXXX:', profile);

			// Create the user OAuth profile
			var providerUserProfile = {
				displayName: profile.displayName,
				username: profile.username,
				provider: 'instagram',
				providerIdentifierField: 'id',
                profileImageURL: profile._json.data.profile_picture,
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}));
};
