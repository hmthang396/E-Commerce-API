const axios = require('axios');
const getFetch = async (para) => {
    let data = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${para.access_token}`,
        {
            headers: {
                Authorization: `Bearer ${para.id_token}`,
            },
        }
    );
    return data;
}

const postFetch = async (para) => {
    const rootURl = 'https://oauth2.googleapis.com/token';
    const data = await axios.post(
        rootURl,
        para,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    )
    return data;
}
module.exports = {
    getFacebookUser: async (para) => {
        try {
            let data = await axios.get(
                `https://graph.facebook.com/me?fields=name,id,picture&&access_token=${para.access_token}`,
            );
            return data;
        } catch (error) {
            console.log(error);
        }
    },

    getFacebookOauthToken: async (para) => {
        try {
            const options = {
                code: para.code,
                client_id: process.env.FACEBOOK_OAUTH_APP_ID,
                client_secret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
                redirect_uri: process.env.FACEBOOK_OAUTH_REDIRECT,
            };
            const qs = new URLSearchParams(options);
            const rootURl = `https://graph.facebook.com/v16.0/oauth/access_token?${qs.toString()}`;
            let data = await axios.get(
                rootURl,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );
            return data;
        } catch (error) {
            console.log(error);
        }
    },
}