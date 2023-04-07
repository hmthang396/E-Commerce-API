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
    getGoogleUser: async (para) => {
        try {
            return await getFetch(para);
        } catch (error) {
            console.log(error);
        }
    },

    getGoogleOauthToken: async (para) => {
        try {
            const options = {
                code: para.code,
                client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
                client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
                grant_type: 'authorization_code',
            };
            return await postFetch(options);
        } catch (error) {
            console.log(error);
        }
    },
}