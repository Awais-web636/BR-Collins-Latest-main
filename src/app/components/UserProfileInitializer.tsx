"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { getRefreshToken } from "@/app/store/features/users/userSlice";
import { fetchUserProfile, fetchSubscription } from "@/app/store/features/users/userSlice";

const UserProfileInitializer = () => {
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector(getRefreshToken);

  useEffect(() => {
    if (refreshToken) {
      dispatch(fetchUserProfile(refreshToken));
      dispatch(fetchSubscription(refreshToken));
    }
  }, [dispatch, refreshToken]);

  return null;
};

export default UserProfileInitializer;
