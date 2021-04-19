import {
  GET_MICROBLOGS_LOADING,
  CREATE_MICROBLOG_LOADING,
  GET_MICROBLOGS_FOR_INVITE_LOADING,
} from './action_types/microblog';

export const getAllMicroBlogs = () => ({type: GET_MICROBLOGS_LOADING});

export const createMicroBlog = (payload) => ({
  type: CREATE_MICROBLOG_LOADING,
  payload,
});
