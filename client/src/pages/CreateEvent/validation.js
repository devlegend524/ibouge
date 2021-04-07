import * as Yup from 'yup';

export const eventSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Must be 3 characters at minimum')
    .required('Please fill out this field.'),
  category: Yup.string().required('Please fill out this field.'),
  date: Yup.string().required('Please fill out this field.'),
  startTimeOfEvent: Yup.string(),
  endTimeOfEvent: Yup.string(),
  eventDescription: Yup.string()
    .min(3, 'Must be 2 characters at minimum')
    .max(300, 'Must be 20 characters or less')
    .required('Please fill out this field.'),
});
