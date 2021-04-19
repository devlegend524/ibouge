import online_image from '../assets/img/contact-online.png';
import idle_image from '../assets/img/contact-idle.png';
import upload_image from '../assets/img/upload-photo.png';
import event_image from '../assets/img/event-icon.png';
export const gender = [
  {id: 0, name: 'Male'},
  {id: 1, name: 'Female'},
  {id: 2, name: 'Other'},
];
export const dob = {
  mm: [
    {id: '01', name: 'January'},
    {id: '02', name: 'February'},
    {id: '03', name: 'March'},
    {id: '04', name: 'April'},
    {id: '05', name: 'May'},
    {id: '06', name: 'June'},
    {id: '07', name: 'July'},
    {id: '08', name: 'August'},
    {id: '09', name: 'September'},
    {id: '10', name: 'October'},
    {id: '11', name: 'November'},
    {id: '12', name: 'December'},
  ],
  dd: [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
  ],
  yyyy: (function () {
    var years = [];
    var date = new Date();
    var thisYear = date.getFullYear();

    for (var i = thisYear; i > thisYear - 300; i--) {
      years.push(i);
    }
    return years;
  })(),
  validate: function () {},
};

export const countries = [
  {name: 'Afghanistan', code: 'AF'},
  {name: 'Åland Islands', code: 'AX'},
  {name: 'Albania', code: 'AL'},
  {name: 'Algeria', code: 'DZ'},
  {name: 'American Samoa', code: 'AS'},
  {name: 'AndorrA', code: 'AD'},
  {name: 'Angola', code: 'AO'},
  {name: 'Anguilla', code: 'AI'},
  {name: 'Antarctica', code: 'AQ'},
  {name: 'Antigua and Barbuda', code: 'AG'},
  {name: 'Argentina', code: 'AR'},
  {name: 'Armenia', code: 'AM'},
  {name: 'Aruba', code: 'AW'},
  {name: 'Australia', code: 'AU'},
  {name: 'Austria', code: 'AT'},
  {name: 'Azerbaijan', code: 'AZ'},
  {name: 'Bahamas', code: 'BS'},
  {name: 'Bahrain', code: 'BH'},
  {name: 'Bangladesh', code: 'BD'},
  {name: 'Barbados', code: 'BB'},
  {name: 'Belarus', code: 'BY'},
  {name: 'Belgium', code: 'BE'},
  {name: 'Belize', code: 'BZ'},
  {name: 'Benin', code: 'BJ'},
  {name: 'Bermuda', code: 'BM'},
  {name: 'Bhutan', code: 'BT'},
  {name: 'Bolivia', code: 'BO'},
  {name: 'Bosnia and Herzegovina', code: 'BA'},
  {name: 'Botswana', code: 'BW'},
  {name: 'Bouvet Island', code: 'BV'},
  {name: 'Brazil', code: 'BR'},
  {name: 'British Indian Ocean Territory', code: 'IO'},
  {name: 'Brunei Darussalam', code: 'BN'},
  {name: 'Bulgaria', code: 'BG'},
  {name: 'Burkina Faso', code: 'BF'},
  {name: 'Burundi', code: 'BI'},
  {name: 'Cambodia', code: 'KH'},
  {name: 'Cameroon', code: 'CM'},
  {name: 'Canada', code: 'CA'},
  {name: 'Cape Verde', code: 'CV'},
  {name: 'Cayman Islands', code: 'KY'},
  {name: 'Central African Republic', code: 'CF'},
  {name: 'Chad', code: 'TD'},
  {name: 'Chile', code: 'CL'},
  {name: 'China', code: 'CN'},
  {name: 'Christmas Island', code: 'CX'},
  {name: 'Cocos (Keeling) Islands', code: 'CC'},
  {name: 'Colombia', code: 'CO'},
  {name: 'Comoros', code: 'KM'},
  {name: 'Congo', code: 'CG'},
  {name: 'Congo, The Democratic Republic of the', code: 'CD'},
  {name: 'Cook Islands', code: 'CK'},
  {name: 'Costa Rica', code: 'CR'},
  {name: "Cote D'Ivoire", code: 'CI'},
  {name: 'Croatia', code: 'HR'},
  {name: 'Cuba', code: 'CU'},
  {name: 'Cyprus', code: 'CY'},
  {name: 'Czech Republic', code: 'CZ'},
  {name: 'Denmark', code: 'DK'},
  {name: 'Djibouti', code: 'DJ'},
  {name: 'Dominica', code: 'DM'},
  {name: 'Dominican Republic', code: 'DO'},
  {name: 'Ecuador', code: 'EC'},
  {name: 'Egypt', code: 'EG'},
  {name: 'El Salvador', code: 'SV'},
  {name: 'Equatorial Guinea', code: 'GQ'},
  {name: 'Eritrea', code: 'ER'},
  {name: 'Estonia', code: 'EE'},
  {name: 'Ethiopia', code: 'ET'},
  {name: 'Falkland Islands (Malvinas)', code: 'FK'},
  {name: 'Faroe Islands', code: 'FO'},
  {name: 'Fiji', code: 'FJ'},
  {name: 'Finland', code: 'FI'},
  {name: 'France', code: 'FR'},
  {name: 'French Guiana', code: 'GF'},
  {name: 'French Polynesia', code: 'PF'},
  {name: 'French Southern Territories', code: 'TF'},
  {name: 'Gabon', code: 'GA'},
  {name: 'Gambia', code: 'GM'},
  {name: 'Georgia', code: 'GE'},
  {name: 'Germany', code: 'DE'},
  {name: 'Ghana', code: 'GH'},
  {name: 'Gibraltar', code: 'GI'},
  {name: 'Greece', code: 'GR'},
  {name: 'Greenland', code: 'GL'},
  {name: 'Grenada', code: 'GD'},
  {name: 'Guadeloupe', code: 'GP'},
  {name: 'Guam', code: 'GU'},
  {name: 'Guatemala', code: 'GT'},
  {name: 'Guernsey', code: 'GG'},
  {name: 'Guinea', code: 'GN'},
  {name: 'Guinea-Bissau', code: 'GW'},
  {name: 'Guyana', code: 'GY'},
  {name: 'Haiti', code: 'HT'},
  {name: 'Heard Island and Mcdonald Islands', code: 'HM'},
  {name: 'Holy See (Vatican City State)', code: 'VA'},
  {name: 'Honduras', code: 'HN'},
  {name: 'Hong Kong', code: 'HK'},
  {name: 'Hungary', code: 'HU'},
  {name: 'Iceland', code: 'IS'},
  {name: 'India', code: 'IN'},
  {name: 'Indonesia', code: 'ID'},
  {name: 'Iran, Islamic Republic Of', code: 'IR'},
  {name: 'Iraq', code: 'IQ'},
  {name: 'Ireland', code: 'IE'},
  {name: 'Isle of Man', code: 'IM'},
  {name: 'Israel', code: 'IL'},
  {name: 'Italy', code: 'IT'},
  {name: 'Jamaica', code: 'JM'},
  {name: 'Japan', code: 'JP'},
  {name: 'Jersey', code: 'JE'},
  {name: 'Jordan', code: 'JO'},
  {name: 'Kazakhstan', code: 'KZ'},
  {name: 'Kenya', code: 'KE'},
  {name: 'Kiribati', code: 'KI'},
  {name: "Korea, Democratic People'S Republic of", code: 'KP'},
  {name: 'Korea, Republic of', code: 'KR'},
  {name: 'Kuwait', code: 'KW'},
  {name: 'Kyrgyzstan', code: 'KG'},
  {name: "Lao People'S Democratic Republic", code: 'LA'},
  {name: 'Latvia', code: 'LV'},
  {name: 'Lebanon', code: 'LB'},
  {name: 'Lesotho', code: 'LS'},
  {name: 'Liberia', code: 'LR'},
  {name: 'Libyan Arab Jamahiriya', code: 'LY'},
  {name: 'Liechtenstein', code: 'LI'},
  {name: 'Lithuania', code: 'LT'},
  {name: 'Luxembourg', code: 'LU'},
  {name: 'Macao', code: 'MO'},
  {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'},
  {name: 'Madagascar', code: 'MG'},
  {name: 'Malawi', code: 'MW'},
  {name: 'Malaysia', code: 'MY'},
  {name: 'Maldives', code: 'MV'},
  {name: 'Mali', code: 'ML'},
  {name: 'Malta', code: 'MT'},
  {name: 'Marshall Islands', code: 'MH'},
  {name: 'Martinique', code: 'MQ'},
  {name: 'Mauritania', code: 'MR'},
  {name: 'Mauritius', code: 'MU'},
  {name: 'Mayotte', code: 'YT'},
  {name: 'Mexico', code: 'MX'},
  {name: 'Micronesia, Federated States of', code: 'FM'},
  {name: 'Moldova, Republic of', code: 'MD'},
  {name: 'Monaco', code: 'MC'},
  {name: 'Mongolia', code: 'MN'},
  {name: 'Montserrat', code: 'MS'},
  {name: 'Morocco', code: 'MA'},
  {name: 'Mozambique', code: 'MZ'},
  {name: 'Myanmar', code: 'MM'},
  {name: 'Namibia', code: 'NA'},
  {name: 'Nauru', code: 'NR'},
  {name: 'Nepal', code: 'NP'},
  {name: 'Netherlands', code: 'NL'},
  {name: 'Netherlands Antilles', code: 'AN'},
  {name: 'New Caledonia', code: 'NC'},
  {name: 'New Zealand', code: 'NZ'},
  {name: 'Nicaragua', code: 'NI'},
  {name: 'Niger', code: 'NE'},
  {name: 'Nigeria', code: 'NG'},
  {name: 'Niue', code: 'NU'},
  {name: 'Norfolk Island', code: 'NF'},
  {name: 'Northern Mariana Islands', code: 'MP'},
  {name: 'Norway', code: 'NO'},
  {name: 'Oman', code: 'OM'},
  {name: 'Pakistan', code: 'PK'},
  {name: 'Palau', code: 'PW'},
  {name: 'Palestinian Territory, Occupied', code: 'PS'},
  {name: 'Panama', code: 'PA'},
  {name: 'Papua New Guinea', code: 'PG'},
  {name: 'Paraguay', code: 'PY'},
  {name: 'Peru', code: 'PE'},
  {name: 'Philippines', code: 'PH'},
  {name: 'Pitcairn', code: 'PN'},
  {name: 'Poland', code: 'PL'},
  {name: 'Portugal', code: 'PT'},
  {name: 'Puerto Rico', code: 'PR'},
  {name: 'Qatar', code: 'QA'},
  {name: 'Reunion', code: 'RE'},
  {name: 'Romania', code: 'RO'},
  {name: 'Russian Federation', code: 'RU'},
  {name: 'RWANDA', code: 'RW'},
  {name: 'Saint Helena', code: 'SH'},
  {name: 'Saint Kitts and Nevis', code: 'KN'},
  {name: 'Saint Lucia', code: 'LC'},
  {name: 'Saint Pierre and Miquelon', code: 'PM'},
  {name: 'Saint Vincent and the Grenadines', code: 'VC'},
  {name: 'Samoa', code: 'WS'},
  {name: 'San Marino', code: 'SM'},
  {name: 'Sao Tome and Principe', code: 'ST'},
  {name: 'Saudi Arabia', code: 'SA'},
  {name: 'Senegal', code: 'SN'},
  {name: 'Serbia and Montenegro', code: 'CS'},
  {name: 'Seychelles', code: 'SC'},
  {name: 'Sierra Leone', code: 'SL'},
  {name: 'Singapore', code: 'SG'},
  {name: 'Slovakia', code: 'SK'},
  {name: 'Slovenia', code: 'SI'},
  {name: 'Solomon Islands', code: 'SB'},
  {name: 'Somalia', code: 'SO'},
  {name: 'South Africa', code: 'ZA'},
  {name: 'South Georgia and the South Sandwich Islands', code: 'GS'},
  {name: 'Spain', code: 'ES'},
  {name: 'Sri Lanka', code: 'LK'},
  {name: 'Sudan', code: 'SD'},
  {name: 'Suriname', code: 'SR'},
  {name: 'Svalbard and Jan Mayen', code: 'SJ'},
  {name: 'Swaziland', code: 'SZ'},
  {name: 'Sweden', code: 'SE'},
  {name: 'Switzerland', code: 'CH'},
  {name: 'Syrian Arab Republic', code: 'SY'},
  {name: 'Taiwan, Province of China', code: 'TW'},
  {name: 'Tajikistan', code: 'TJ'},
  {name: 'Tanzania, United Republic of', code: 'TZ'},
  {name: 'Thailand', code: 'TH'},
  {name: 'Timor-Leste', code: 'TL'},
  {name: 'Togo', code: 'TG'},
  {name: 'Tokelau', code: 'TK'},
  {name: 'Tonga', code: 'TO'},
  {name: 'Trinidad and Tobago', code: 'TT'},
  {name: 'Tunisia', code: 'TN'},
  {name: 'Turkey', code: 'TR'},
  {name: 'Turkmenistan', code: 'TM'},
  {name: 'Turks and Caicos Islands', code: 'TC'},
  {name: 'Tuvalu', code: 'TV'},
  {name: 'Uganda', code: 'UG'},
  {name: 'Ukraine', code: 'UA'},
  {name: 'United Arab Emirates', code: 'AE'},
  {name: 'United Kingdom', code: 'GB'},
  {name: 'United States', code: 'US'},
  {name: 'United States Minor Outlying Islands', code: 'UM'},
  {name: 'Uruguay', code: 'UY'},
  {name: 'Uzbekistan', code: 'UZ'},
  {name: 'Vanuatu', code: 'VU'},
  {name: 'Venezuela', code: 'VE'},
  {name: 'Viet Nam', code: 'VN'},
  {name: 'Virgin Islands, British', code: 'VG'},
  {name: 'Virgin Islands, U.S.', code: 'VI'},
  {name: 'Wallis and Futuna', code: 'WF'},
  {name: 'Western Sahara', code: 'EH'},
  {name: 'Yemen', code: 'YE'},
  {name: 'Zambia', code: 'ZM'},
  {name: 'Zimbabwe', code: 'ZW'},
];

export const getPrintableLocation = (user) => {
  let country = null;
  let city = user.location.city;

  if (!city && !user.location.country) {
    return '';
  }

  if (user.location.country) {
    country = this.getCountryByCode(user.location.country).name;
  }

  if (country && !city) {
    return country;
  } else if (city && !country) {
    return city;
  }

  return `${city}, ${country}`;
};

export const getCountryByCode = (code) => {
  if (!code) {
    return null;
  }

  var country = this.countries.filter(function (item) {
    return item.code === code;
  });

  if (country.length === 0) {
    return null;
  }

  return country[0];
};

export const deleteAllCookies = () => {
  var cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf('=');
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

export const attachTokenToHeaders = (auth) => {
  const token = auth.token;

  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };

  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
};
export const getInterests = (arr) => {
  if (!arr || arr.length === 0) {
    return '';
  }

  var interests = '';
  for (var i = 0; i < arr.length; i++) {
    if (i === arr.length - 1) {
      interests += arr[i];
    } else {
      interests += arr[i] + ', ';
    }
  }

  return interests.trim();
};
export const getAge = (user) => {
  if (user.dob) {
    return Math.floor((new Date() - new Date(user.dob)) / 31536000000);
  }
  return '';
};

export const getUniqueIcons = (users) => {
  var existingFeatureKeys = {};

  var uniqueFeatures = users.filter(function (el) {
    if (existingFeatureKeys[el.properties.user_id]) {
      return false;
    } else {
      existingFeatureKeys[el.properties.user_id] = true;
      return true;
    }
  });

  return uniqueFeatures;
};
export const getGenderAbbrev = (gender) => {
  if (gender === 0) {
    return 'M';
  } else if (gender === 1) {
    return 'F';
  } else {
    return '';
  }
};
export const getArrayOfGeoJSON = (usersData) => {
  let arrayOfGeoJSON = [];
  let geometry;
  let coordinates;
  let genderAbbrev;
  let onlineImageBorder;
  for (let position in usersData) {
    coordinates = usersData[position].location.coordinates;
    genderAbbrev = getGenderAbbrev(usersData[position].gender);
    onlineImageBorder = usersData[position].is_online ? ' #40ff00' : '#FFBA52';
    if (usersData[position].profile_pic) {
      // geometry for where the users blue dot goes in the map
      geometry = {
        type: 'Feature',
        properties: {
          description:
            '<div>\n' +
            '<div style="display: flex;">\n' +
            '<img style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px; margin-top: 5px; border: 4px solid\n' +
            onlineImageBorder +
            ';" src="\n' +
            usersData[position].profile_pic +
            '">\n' +
            '<div style="font-weight: 400; color: #8e8e8e;">\n' +
            '<div style="font-weight: bold; margin-top: 5px">\n' +
            usersData[position].fname +
            ' ' +
            usersData[position].lname +
            '</div>\n' +
            '<div><span style="color: #1E90FF;">\n' +
            genderAbbrev +
            ' ' +
            getAge(usersData[position]) +
            '</span>\n' +
            ' \n' +
            '- \n' +
            getInterests(usersData[position].profile.interests) +
            '</div>\n' +
            '</div>\n' +
            '<div style="display: flex; margin-left: 12px; padding-left: 5px; border-left: 2px solid #DDD;">\n' +
            '<a href="profile/\n' +
            usersData[position]._id +
            '" style="display: flex;"><i class="fa fa-chevron-right" aria-hidden="true" style="margin: auto;"></i></a>\n' +
            '</div>\n' +
            '</div>\n' +
            '</div>\n',
          user_id: usersData[position]._id,
          gender: usersData[position].gender,
          fname: usersData[position].fname,
          lname: usersData[position].lname,
        },
        geometry: {
          type: 'Point',
          coordinates: coordinates,
        },
      };
    } else {
      // geometry for where the users blue dot goes in the map
      geometry = {
        type: 'Feature',
        properties: {
          description:
            '<div><div style="display: flex;"><img style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px; margin-top: 5px; border: 4px solid\n' +
            onlineImageBorder +
            ';" src="\n' +
            upload_image +
            '">\n' +
            '<div style="font-weight: 400; color: #8e8e8e;">\n' +
            '<div style="font-weight: bold; margin-top: 5px">\n' +
            usersData[position].fname +
            ' ' +
            usersData[position].lname +
            '</div>\n' +
            '<div><span style="color: #1E90FF;">\n' +
            genderAbbrev +
            ' ' +
            getAge(usersData[position]) +
            '</span>\n' +
            ' ' +
            '- ' +
            getInterests(usersData[position].profile.interests) +
            '</div>\n' +
            '</div>\n' +
            '<div style="display: flex; margin-left: 12px; padding-left: 5px; border-left: 2px solid #DDD;"><a href="profile/\n' +
            usersData[position]._id +
            '" style="display: flex;"><i class="fa fa-chevron-right" aria-hidden="true" style="margin: auto;"></i></a></div>\n' +
            '</div>\n' +
            '</div>\n',
          user_id: usersData[position]._id,
          gender: usersData[position].gender,
          fname: usersData[position].fname,
          lname: usersData[position].lname,
        },
        geometry: {
          type: 'Point',
          coordinates: coordinates,
        },
      };
    }

    // push the new geometry onto array holding
    // GeoJSON for users
    arrayOfGeoJSON.push(geometry);
  }
  return arrayOfGeoJSON;
};
export const getMicroBlogOfGeoJSON = (microblogs) => {
  // array to hold Microblog GeoJSON info
  let arrayOfGeoJSON = [];
  let coordinates;
  let dateOfMicroblog;
  let geometry;
  // Iterate through all Microblogs and create new GeoJSON
  // based off the lng / lat coordinates
  for (let position in microblogs) {
    coordinates = microblogs[position].coordinates;

    dateOfMicroblog = new Date(
      microblogs[position].created_date
    ).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    // geometry for where the microblogging pink dot goes in the map
    geometry = {
      type: 'Feature',
      properties: {
        description:
          '<div class="events-wrap-view" style="display: flex; padding: 0; border: none;"><div>\n' +
          '<img src="\n' +
          microblogs[position].microblog_img
            ? microblogs[position].microblog_img
            : event_image +
              '" class="img-of-creator" /></div>\n' +
              '<div style="margin-top: 5px;">\n' +
              '<div class="name-of-microblog">\n' +
              '<span>\n' +
              microblogs[position].name +
              '</span></div>\n' +
              '<div class="amount-of-users">\n' +
              '<a href="" class="microblog-box-users microblog-users" style="float: none"><i class="fa fa-user" aria-hidden="true"></i><span>\n' +
              microblogs[position].users.length +
              '</span></a>\n' +
              '<span style="float: left">\n' +
              dateOfMicroblog +
              '</span>\n' +
              '</div>\n' +
              '</div>\n' +
              '</div>\n',
        room: microblogs[position].room,
        name: microblogs[position].name,
        users: microblogs[position].users,
        created_date: microblogs[position].created_date,
      },
      geometry: {
        type: 'Point',
        coordinates: coordinates,
      },
    };

    // push the new geometry onto array holding
    // GeoJSON for microblogs
    arrayOfGeoJSON.push(geometry);
  }
  return arrayOfGeoJSON;
};

export const getEventOfGetJson = (events) => {
  // array to hold Event GeoJSON info
  let arrayOfGeoJSON = [];
  let coordinates;
  let dateOfEvent;
  let timeOfEvent;
  let geometry;
  // hold the eventsImage URL
  let eventImage = '';

  // Iterate through all events and create new GeoJSON
  // based off the lng / lat coordinates
  for (let position in events) {
    coordinates = events[position].location.coordinates;

    // get the actual date and time of the event
    dateOfEvent = new Date(events[position].dateOfEvent).toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }
    );
    // timeOfEvent = new Date(events[position].eventStartTime).toLocaleTimeString(
    //   'en-US',
    //   {
    //     hour: '2-digit',
    //     minute: '2-digit',
    //   }
    // );

    // if the user did not add an event image
    if (events[position].eventImage === undefined) {
      // use a generic image
      events[position].eventImage = event_image;
    }

    // geometry for where the events purple dot goes in the map
    geometry = {
      type: 'Feature',
      properties: {
        description:
          '<div class="events-wrap-view" style="display: flex; padding: 0; border: none;">\n' +
          '<div>\n' +
          '<img src="\n' +
          events[position].eventImage +
          '" class="img-of-creator" />\n' +
          '</div>\n' +
          '<div style="margin-top: 5px;">\n' +
          '<div class="name-of-microblog">\n' +
          '<span>\n' +
          events[position].name +
          '</span>\n' +
          '</div>\n' +
          '<div class="amount-of-users">\n' +
          '<a href="" class="microblog-box-users microblog-users" style="float: none"><i class="fa fa-user" aria-hidden="true"></i><span>\n' +
          events[position].going.length +
          '</span></a>\n' +
          '<span style="float: left">\n' +
          dateOfEvent +
          ' @ \n' +
          events[position].eventStartTime +
          '</span>\n' +
          '</div>\n' +
          '</div>\n' +
          '</div>\n',
        id: events[position]._id,
        name: events[position].name,
        eventImage: events[position].eventImage,
        usersWhoAreGoing: events[position].usersWhoAreGoing,
        dateOfEvent: events[position].dateOfEvent,
        eventStartTime: events[position].eventStartTime,
      },
      geometry: {
        type: 'Point',
        coordinates: coordinates,
      },
    };

    // push the new geometry onto array holding
    // GeoJSON for events
    arrayOfGeoJSON.push(geometry);
  }
  return arrayOfGeoJSON;
};
export const getImage = (item) => {
  var content = '';
  if (!item.is_group_chat) {
    if (item.image) {
      content =
        '<img style="min-width: 45px; width: 45px; height: 45px; margin:0 10px; border-radius: 50%;" alt="Image" src="' +
        item.image +
        '">';
    } else {
      content =
        '<img style="min-width: 45px; width: 45px; height: 45px; margin:0 10px; border-radius: 50%;" alt="Image" src="img/upload-photo.png">';
    }
  } else {
    var images = '';
    for (var i = 0; i < 4; i++) {
      if (item.images[i]) {
        if (item.images[i]) {
          images +=
            '<img style="width: 17px; height: 17px; border-radius: 50%; margin: 2px;" alt="Image" src="' +
            item.images[i] +
            '">';
        } else {
          images +=
            '<img style="width: 17px; height: 17px; border-radius: 50%; margin: 2px;" alt="Image" src="img/upload-photo.png">';
        }
      }
    }
    content =
      '<div style="text-align: center: min-width: 45px; width: 45px; height: 45px; margin:0 10px;">\n' +
      images +
      '</div>\n';
  }
  return content;
};

export const getOnline = (item) => {
  if (!item.is_group_chat) {
    return (
      '<span style="float: right; font-size: 9px; margin: auto 15px auto auto;">\n' +
      '<i class="fa fa-circle \n' +
      (item.is_online ? 'online' : 'idle') +
      '" aria-hidden="true" ></i>\n' +
      '</span>\n'
    );
  } else {
    return '';
  }
};

export const getReadStatus = (item, id) => {
  var status = '';
  if (item.messages[0].from_id === id) {
    if (item.messages[0].read_at) {
      status = 'Read at ' + item.messages[0].read_at;
    } else {
      status = 'Unread';
    }
  }
  return status;
};
