import {createSlice} from '@reduxjs/toolkit';

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: any;
};

const initialState = {
  userId: '',
  user: {} as User,
  allUsers: [] as User[],
};

const userSlices = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUserId: (state, actions) => {
      state.userId = actions.payload;
    },
    setUser: (state, actions) => {
      state.user = actions.payload;
    },
    setAllUsers: (state, actions) => {
      state.allUsers = actions.payload;
    },
  },
});

export const {setUserId, setUser, setAllUsers} = userSlices.actions;

export default userSlices.reducer;
