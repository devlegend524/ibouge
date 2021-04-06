import axios from 'axios';

export const proposer_id = (postData) => {
    return axios.get('http://52.66.252.194:8000/proposer_id/' +  postData)
}

export const registerUserWithEmail = (postData) => {
    return axios.post('/auth/signup', postData);
}

export const registerResendEmail = (postData) => {
    return axios.post('/auth/resend-email', postData);
}
