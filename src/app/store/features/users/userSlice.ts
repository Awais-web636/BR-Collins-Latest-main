import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../index";
import { IUser } from "@/app/types/user.contract";
import { ISubscription } from "@/app/types/subscription.contract";
import { api } from "@/app/utils/axios";
import { IOrganization } from "@/app/types/organization.contract";

// Define a type for the slice state
interface UserState {
  user: IUser | {};
  subscription: ISubscription | {};
  organization: IOrganization | {};
  accessToken: string | null;
  refreshToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Define the initial state using that type
const initialState: UserState = {
  user: {},
  subscription: {},
  organization: {},
  accessToken: null,
  refreshToken: null,
  status: "idle",
  error: null,
};

// Async thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch user profile");
    }
  }
);

// Async thunk to fetch subscription
export const fetchSubscription = createAsyncThunk(
  "user/fetchSubscription",
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me/subscription", {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch subscription");
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      state.user = { ...state.user, ...action.payload };
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    setSubscription: (state, action: PayloadAction<ISubscription>) => {
      state.subscription = action.payload;
    },
    logout: (state) => {
      state.user = {};
      state.accessToken = null;
      state.refreshToken = null;
      state.subscription = {};
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.organization = action.payload.organization;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchSubscription.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscription = action.payload;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setUser, setAccessToken, setRefreshToken, logout, updateUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export const isUserLoggedIn = (state: RootState) => state.user.accessToken !== null;

export const getAccessToken = (state: RootState) => state.user.accessToken;

export const getRefreshToken = (state: RootState) => state.user.refreshToken;

export const getSubscription = (state: RootState) => state.user.subscription;

export default userSlice.reducer;
