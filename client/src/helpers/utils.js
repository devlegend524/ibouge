import online_image from "../assets/img/contact-online.png";
import idle_image from "../assets/img/contact-idle.png";
import upload_image from "../assets/img/upload-photo.png";
export const gender = [
  { id: 0, name: "Male" },
  { id: 1, name: "Female" },
  { id: 2, name: "Other" },
];
export const dob = {
  mm: [
    { id: "01", name: "January" },
    { id: "02", name: "February" },
    { id: "03", name: "March" },
    { id: "04", name: "April" },
    { id: "05", name: "May" },
    { id: "06", name: "June" },
    { id: "07", name: "July" },
    { id: "08", name: "August" },
    { id: "09", name: "September" },
    { id: "10", name: "October" },
    { id: "11", name: "November" },
    { id: "12", name: "December" },
  ],
  dd: [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
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
  { name: "Afghanistan", code: "AF" },
  { name: "Åland Islands", code: "AX" },
  { name: "Albania", code: "AL" },
  { name: "Algeria", code: "DZ" },
  { name: "American Samoa", code: "AS" },
  { name: "AndorrA", code: "AD" },
  { name: "Angola", code: "AO" },
  { name: "Anguilla", code: "AI" },
  { name: "Antarctica", code: "AQ" },
  { name: "Antigua and Barbuda", code: "AG" },
  { name: "Argentina", code: "AR" },
  { name: "Armenia", code: "AM" },
  { name: "Aruba", code: "AW" },
  { name: "Australia", code: "AU" },
  { name: "Austria", code: "AT" },
  { name: "Azerbaijan", code: "AZ" },
  { name: "Bahamas", code: "BS" },
  { name: "Bahrain", code: "BH" },
  { name: "Bangladesh", code: "BD" },
  { name: "Barbados", code: "BB" },
  { name: "Belarus", code: "BY" },
  { name: "Belgium", code: "BE" },
  { name: "Belize", code: "BZ" },
  { name: "Benin", code: "BJ" },
  { name: "Bermuda", code: "BM" },
  { name: "Bhutan", code: "BT" },
  { name: "Bolivia", code: "BO" },
  { name: "Bosnia and Herzegovina", code: "BA" },
  { name: "Botswana", code: "BW" },
  { name: "Bouvet Island", code: "BV" },
  { name: "Brazil", code: "BR" },
  { name: "British Indian Ocean Territory", code: "IO" },
  { name: "Brunei Darussalam", code: "BN" },
  { name: "Bulgaria", code: "BG" },
  { name: "Burkina Faso", code: "BF" },
  { name: "Burundi", code: "BI" },
  { name: "Cambodia", code: "KH" },
  { name: "Cameroon", code: "CM" },
  { name: "Canada", code: "CA" },
  { name: "Cape Verde", code: "CV" },
  { name: "Cayman Islands", code: "KY" },
  { name: "Central African Republic", code: "CF" },
  { name: "Chad", code: "TD" },
  { name: "Chile", code: "CL" },
  { name: "China", code: "CN" },
  { name: "Christmas Island", code: "CX" },
  { name: "Cocos (Keeling) Islands", code: "CC" },
  { name: "Colombia", code: "CO" },
  { name: "Comoros", code: "KM" },
  { name: "Congo", code: "CG" },
  { name: "Congo, The Democratic Republic of the", code: "CD" },
  { name: "Cook Islands", code: "CK" },
  { name: "Costa Rica", code: "CR" },
  { name: "Cote D'Ivoire", code: "CI" },
  { name: "Croatia", code: "HR" },
  { name: "Cuba", code: "CU" },
  { name: "Cyprus", code: "CY" },
  { name: "Czech Republic", code: "CZ" },
  { name: "Denmark", code: "DK" },
  { name: "Djibouti", code: "DJ" },
  { name: "Dominica", code: "DM" },
  { name: "Dominican Republic", code: "DO" },
  { name: "Ecuador", code: "EC" },
  { name: "Egypt", code: "EG" },
  { name: "El Salvador", code: "SV" },
  { name: "Equatorial Guinea", code: "GQ" },
  { name: "Eritrea", code: "ER" },
  { name: "Estonia", code: "EE" },
  { name: "Ethiopia", code: "ET" },
  { name: "Falkland Islands (Malvinas)", code: "FK" },
  { name: "Faroe Islands", code: "FO" },
  { name: "Fiji", code: "FJ" },
  { name: "Finland", code: "FI" },
  { name: "France", code: "FR" },
  { name: "French Guiana", code: "GF" },
  { name: "French Polynesia", code: "PF" },
  { name: "French Southern Territories", code: "TF" },
  { name: "Gabon", code: "GA" },
  { name: "Gambia", code: "GM" },
  { name: "Georgia", code: "GE" },
  { name: "Germany", code: "DE" },
  { name: "Ghana", code: "GH" },
  { name: "Gibraltar", code: "GI" },
  { name: "Greece", code: "GR" },
  { name: "Greenland", code: "GL" },
  { name: "Grenada", code: "GD" },
  { name: "Guadeloupe", code: "GP" },
  { name: "Guam", code: "GU" },
  { name: "Guatemala", code: "GT" },
  { name: "Guernsey", code: "GG" },
  { name: "Guinea", code: "GN" },
  { name: "Guinea-Bissau", code: "GW" },
  { name: "Guyana", code: "GY" },
  { name: "Haiti", code: "HT" },
  { name: "Heard Island and Mcdonald Islands", code: "HM" },
  { name: "Holy See (Vatican City State)", code: "VA" },
  { name: "Honduras", code: "HN" },
  { name: "Hong Kong", code: "HK" },
  { name: "Hungary", code: "HU" },
  { name: "Iceland", code: "IS" },
  { name: "India", code: "IN" },
  { name: "Indonesia", code: "ID" },
  { name: "Iran, Islamic Republic Of", code: "IR" },
  { name: "Iraq", code: "IQ" },
  { name: "Ireland", code: "IE" },
  { name: "Isle of Man", code: "IM" },
  { name: "Israel", code: "IL" },
  { name: "Italy", code: "IT" },
  { name: "Jamaica", code: "JM" },
  { name: "Japan", code: "JP" },
  { name: "Jersey", code: "JE" },
  { name: "Jordan", code: "JO" },
  { name: "Kazakhstan", code: "KZ" },
  { name: "Kenya", code: "KE" },
  { name: "Kiribati", code: "KI" },
  { name: "Korea, Democratic People'S Republic of", code: "KP" },
  { name: "Korea, Republic of", code: "KR" },
  { name: "Kuwait", code: "KW" },
  { name: "Kyrgyzstan", code: "KG" },
  { name: "Lao People'S Democratic Republic", code: "LA" },
  { name: "Latvia", code: "LV" },
  { name: "Lebanon", code: "LB" },
  { name: "Lesotho", code: "LS" },
  { name: "Liberia", code: "LR" },
  { name: "Libyan Arab Jamahiriya", code: "LY" },
  { name: "Liechtenstein", code: "LI" },
  { name: "Lithuania", code: "LT" },
  { name: "Luxembourg", code: "LU" },
  { name: "Macao", code: "MO" },
  { name: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
  { name: "Madagascar", code: "MG" },
  { name: "Malawi", code: "MW" },
  { name: "Malaysia", code: "MY" },
  { name: "Maldives", code: "MV" },
  { name: "Mali", code: "ML" },
  { name: "Malta", code: "MT" },
  { name: "Marshall Islands", code: "MH" },
  { name: "Martinique", code: "MQ" },
  { name: "Mauritania", code: "MR" },
  { name: "Mauritius", code: "MU" },
  { name: "Mayotte", code: "YT" },
  { name: "Mexico", code: "MX" },
  { name: "Micronesia, Federated States of", code: "FM" },
  { name: "Moldova, Republic of", code: "MD" },
  { name: "Monaco", code: "MC" },
  { name: "Mongolia", code: "MN" },
  { name: "Montserrat", code: "MS" },
  { name: "Morocco", code: "MA" },
  { name: "Mozambique", code: "MZ" },
  { name: "Myanmar", code: "MM" },
  { name: "Namibia", code: "NA" },
  { name: "Nauru", code: "NR" },
  { name: "Nepal", code: "NP" },
  { name: "Netherlands", code: "NL" },
  { name: "Netherlands Antilles", code: "AN" },
  { name: "New Caledonia", code: "NC" },
  { name: "New Zealand", code: "NZ" },
  { name: "Nicaragua", code: "NI" },
  { name: "Niger", code: "NE" },
  { name: "Nigeria", code: "NG" },
  { name: "Niue", code: "NU" },
  { name: "Norfolk Island", code: "NF" },
  { name: "Northern Mariana Islands", code: "MP" },
  { name: "Norway", code: "NO" },
  { name: "Oman", code: "OM" },
  { name: "Pakistan", code: "PK" },
  { name: "Palau", code: "PW" },
  { name: "Palestinian Territory, Occupied", code: "PS" },
  { name: "Panama", code: "PA" },
  { name: "Papua New Guinea", code: "PG" },
  { name: "Paraguay", code: "PY" },
  { name: "Peru", code: "PE" },
  { name: "Philippines", code: "PH" },
  { name: "Pitcairn", code: "PN" },
  { name: "Poland", code: "PL" },
  { name: "Portugal", code: "PT" },
  { name: "Puerto Rico", code: "PR" },
  { name: "Qatar", code: "QA" },
  { name: "Reunion", code: "RE" },
  { name: "Romania", code: "RO" },
  { name: "Russian Federation", code: "RU" },
  { name: "RWANDA", code: "RW" },
  { name: "Saint Helena", code: "SH" },
  { name: "Saint Kitts and Nevis", code: "KN" },
  { name: "Saint Lucia", code: "LC" },
  { name: "Saint Pierre and Miquelon", code: "PM" },
  { name: "Saint Vincent and the Grenadines", code: "VC" },
  { name: "Samoa", code: "WS" },
  { name: "San Marino", code: "SM" },
  { name: "Sao Tome and Principe", code: "ST" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "Senegal", code: "SN" },
  { name: "Serbia and Montenegro", code: "CS" },
  { name: "Seychelles", code: "SC" },
  { name: "Sierra Leone", code: "SL" },
  { name: "Singapore", code: "SG" },
  { name: "Slovakia", code: "SK" },
  { name: "Slovenia", code: "SI" },
  { name: "Solomon Islands", code: "SB" },
  { name: "Somalia", code: "SO" },
  { name: "South Africa", code: "ZA" },
  { name: "South Georgia and the South Sandwich Islands", code: "GS" },
  { name: "Spain", code: "ES" },
  { name: "Sri Lanka", code: "LK" },
  { name: "Sudan", code: "SD" },
  { name: "Suriname", code: "SR" },
  { name: "Svalbard and Jan Mayen", code: "SJ" },
  { name: "Swaziland", code: "SZ" },
  { name: "Sweden", code: "SE" },
  { name: "Switzerland", code: "CH" },
  { name: "Syrian Arab Republic", code: "SY" },
  { name: "Taiwan, Province of China", code: "TW" },
  { name: "Tajikistan", code: "TJ" },
  { name: "Tanzania, United Republic of", code: "TZ" },
  { name: "Thailand", code: "TH" },
  { name: "Timor-Leste", code: "TL" },
  { name: "Togo", code: "TG" },
  { name: "Tokelau", code: "TK" },
  { name: "Tonga", code: "TO" },
  { name: "Trinidad and Tobago", code: "TT" },
  { name: "Tunisia", code: "TN" },
  { name: "Turkey", code: "TR" },
  { name: "Turkmenistan", code: "TM" },
  { name: "Turks and Caicos Islands", code: "TC" },
  { name: "Tuvalu", code: "TV" },
  { name: "Uganda", code: "UG" },
  { name: "Ukraine", code: "UA" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "United Kingdom", code: "GB" },
  { name: "United States", code: "US" },
  { name: "United States Minor Outlying Islands", code: "UM" },
  { name: "Uruguay", code: "UY" },
  { name: "Uzbekistan", code: "UZ" },
  { name: "Vanuatu", code: "VU" },
  { name: "Venezuela", code: "VE" },
  { name: "Viet Nam", code: "VN" },
  { name: "Virgin Islands, British", code: "VG" },
  { name: "Virgin Islands, U.S.", code: "VI" },
  { name: "Wallis and Futuna", code: "WF" },
  { name: "Western Sahara", code: "EH" },
  { name: "Yemen", code: "YE" },
  { name: "Zambia", code: "ZM" },
  { name: "Zimbabwe", code: "ZW" },
];

export const getPrintableLocation = (user) => {
  let country = null;
  let city = user.location.city;

  if (!city && !user.location.country) {
    return "";
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

  if (country.length == 0) {
    return null;
  }

  return country[0];
};

export const deleteAllCookies = () => {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

export const attachTokenToHeaders = (auth) => {
  const token = auth.token;

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};
export const getInterests = (arr) => {
  if (!arr || arr.length === 0) {
    return "";
  }

  var interests = "";
  for (var i = 0; i < arr.length; i++) {
    if (i === arr.length - 1) {
      interests += arr[i];
    } else {
      interests += arr[i] + ", ";
    }
  }

  return interests.trim();
};
export const getAge = (user) => {
  if (user.dob) {
    return Math.floor((new Date() - new Date(user.dob)) / 31536000000);
  }
  return "";
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
    return "M";
  } else if (gender === 1) {
    return "F";
  } else {
    return "";
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
    onlineImageBorder = usersData[position].is_online ? " #40ff00" : "#FFBA52";
    if (usersData[position].profile_pic) {
      // geometry for where the users blue dot goes in the map
      geometry = {
        type: "Feature",
        properties: {
          description:
            '<div>\
            <div style="display: flex;">\
              <img style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px; margin-top: 5px; border: 4px solid' +
            onlineImageBorder +
            ';" src="' +
            usersData[position].profile_pic +
            '">\
              <div style="font-weight: 400; color: #8e8e8e;">\
                <div style="font-weight: bold; margin-top: 5px">' +
            usersData[position].fname +
            " " +
            usersData[position].lname +
            '</div>\
                <div><span style="color: #1E90FF;">' +
            genderAbbrev +
            " " +
            getAge(usersData[position]) +
            "</span>" +
            " " +
            "- " +
            getInterests(usersData[position].profile.interests) +
            '</div>\
              </div>\
              <div style="display: flex; margin-left: 12px; padding-left: 5px; border-left: 2px solid #DDD;"><i class="fa fa-chevron-right" aria-hidden="true" style="margin: auto;"></i></div>\
            </div>\
          </div>',
          user_id: usersData[position]._id,
        },
        geometry: {
          type: "Point",
          coordinates: coordinates,
        },
      };
    } else {
      // geometry for where the users blue dot goes in the map
      geometry = {
        type: "Feature",
        properties: {
          description:
            '<div><div style="display: flex;"><img style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px; margin-top: 5px; border: 4px solid' +
            onlineImageBorder +
            ';" src="' +
            upload_image +
            '">\
              <div style="font-weight: 400; color: #8e8e8e;">\
                <div style="font-weight: bold; margin-top: 5px">' +
            usersData[position].fname +
            " " +
            usersData[position].lname +
            '</div>\
                <div><span style="color: #1E90FF;">' +
            genderAbbrev +
            " " +
            getAge(usersData[position]) +
            "</span>" +
            " " +
            "- " +
            getInterests(usersData[position].profile.interests) +
            '</div>\
              </div>\
              <div style="display: flex; margin-left: 12px; padding-left: 5px; border-left: 2px solid #DDD;"><i class="fa fa-chevron-right" aria-hidden="true" style="margin: auto;"></i></div>\
            </div>\
          </div>',
          user_id: usersData[position]._id,
        },
        geometry: {
          type: "Point",
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
