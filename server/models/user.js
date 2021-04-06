//create new model

var mongoose = require('mongoose'); //referring mongoose for creating user friendly class type model.

//defining schema for user model

var userSchema = new mongoose.Schema({
	email: String,
	facebook_id: String,
	google_id: String,
	twitter_id: String,
	role: String,
	fname: String,
	lname: String,
	username: String,
	password: String,
	gender: Number,
	dob: Date,
	minimum_age: String,
	ip: String,
	latitude: Number,
	longitude: Number,
	account_type: Number,
	profile_pic: String,
	profile_pic_original: String,
	area_name: String,
	area_id: String,
	profile: {
		about_me: String,
		interests: [String],
		languages: [String],
		website: String,
		phone: String
	},
	location: {
		coordinates: Array,
		bbox: Object,
		addrs1: String,
		addrs2: String,
		country: String,
		state: String,
		city: String,
		zip: String,
		lastCityFollowed: String,
		cityToFollow: {
			cityName: String,
			bbox: Object,
			center: Object
		},
		extraCityToFollow0: {
			cityName: String,
			bbox: Object,
			center: Object
		},
		extraCityToFollow1: {
			cityName: String,
			bbox: Object,
			center: Object
		},
		extraCityToFollow2: {
			cityName: String,
			bbox: Object,
			center: Object
		}
	},
	privacy: {
		only_members_see_profile: { type: Boolean, default: true },
		share_recent_events: { type: Boolean, default: true },
		show_my_friends: { type: Boolean, default: true },
		is_profile_public: { type: Boolean, default: true },
		new_messages: { type: Boolean, default: false },
		block_list: [String]
	},
	notifications: {
    //all of these were set to true by Tati, except last one which is currently not being used
		new_messages: { type: Boolean, default: true },
		new_events: { type: Boolean, default: true },
		friend_requests: { type: Boolean, default: true },
		invitations_to_conversation: { type: Boolean, default: true },
		mutual_likes: { type: Boolean, default: false }
	},
	activation_token: String,
	is_activated: { type: Boolean, default: false },
	activation_status: { type: Number, default: 0 }, // sign up -> 0 | step one -> 1 | step two -> 2 | step 3 -> 3
	password_restore_token: String,
	remember_me: String,
	is_online: { type: Boolean, default: false },
	friend_requests_sent: [String],
	unread_notifications: [String],
	bookmarked_microblogs: [String],
	notifications_last_viewed_time: Date,
	inbox_last_viewed_time: Date,
	created_at: { type: Date, default: Date.now },
	last_updated: { type: Date, default: Date.now },
	last_email_received: Date,
});
mongoose.model('User', userSchema);

var User = mongoose.model('User');

exports.findByUsername = function(userName, callback) {
	User.findOne({ user_name: userName}, function(err, user) {
		if (err) {
			return callback(err);
		}
		return callback(null, user);
	});
};

exports.findByEmail = function(email, callback) {
	User.findOne({email: email}, function(err, user) {
		if (err) {
			return callback(err);
		}
		return callback(null, user);
	});
};

exports.findById = function(id, callback) {
	User.findById(id, function(err, user) {
		if (err) {
			return callback(err);
		}
		return callback(null, user);
	});
};

exports.findByIds = function(ids, callback) {
	var oids = [];
	for (var id in ids) {
		oids.append(mongoose.Types.ObjectId(id));
	}

	User.find({
		'_id': {$in: oids}
	}, function(err, docs) {
		if (err) {
			return callback(err);
		} else {
			return callback(null, docs);
		}
	});
};
