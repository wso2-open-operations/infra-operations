// Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosResponse, HttpStatusCode } from "axios";

import { State } from "@/types/types";
import { AppConfig } from "@config/config";
import { SnackMessage } from "@config/constant";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";
import { APIService } from "@utils/apiService";

interface TeamsState {
  state: State;
  teams: string[] | null;
  errorMessage: string | null;
}

const initialState: TeamsState = {
  state: State.idle,
  teams: null,
  errorMessage: null,
};

export const fetchTeams = createAsyncThunk<string[], string, { rejectValue: string }>(
  "teams/fetchTeams",
  async (organization: string, { dispatch, rejectWithValue }) => {
    APIService.getCancelToken().cancel();
    const newCancelTokenSource = APIService.updateCancelToken();
    try {
      const response: AxiosResponse<string[]> = await APIService.getInstance().get(
        AppConfig.serviceUrls.teams,
        {
          params: { organization },
          cancelToken: newCancelTokenSource.token,
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        return rejectWithValue("Request canceled");
      }

      if (axios.isAxiosError(error)) {
        dispatch(
          enqueueSnackbarMessage({
            message:
              error.response?.status === HttpStatusCode.InternalServerError
                ? SnackMessage.error.fetchTeamsMessage
                : String(error.response?.data?.message || "Unknown error"),
            type: "error",
          }),
        );
        return rejectWithValue(error.response?.data || "Failed to fetch teams");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    resetTeamsState(state) {
      state.state = State.idle;
      state.teams = null;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.state = State.loading;
        state.errorMessage = "Fetching teams...";
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.state = State.success;
        state.teams = action.payload;
        state.errorMessage = null;
      })
      .addCase(fetchTeams.rejected, (state) => {
        state.state = State.failed;
        state.errorMessage = "Failed to fetch teams";
      });
  },
});

export const { resetTeamsState } = teamsSlice.actions;
export default teamsSlice.reducer;
