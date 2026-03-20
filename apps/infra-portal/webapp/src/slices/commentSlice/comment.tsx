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

export interface Comment {
  commentId: number;
  requestId: string;
  authorEmail: string;
  commentText: string;
  createdAt: string;
}

interface CommentsState {
  state: State;
  functionType?: string;
  comments: Comment[] | undefined;
  errorMessage: string | null;
}

const initialState: CommentsState = {
  state: State.idle,
  comments: undefined,
  errorMessage: null,
  functionType: undefined,
};

export interface AddCommentPayload {
  requestId: number;
  authorEmail: string;
  commentText: string;
}

export const fetchComments = createAsyncThunk<Comment[], number, { rejectValue: string }>(
  "comments/fetchComments",
  async (requestId: number, { dispatch, rejectWithValue }) => {
    APIService.getCancelToken().cancel();
    const newCancelTokenSource = APIService.updateCancelToken();
    try {
      const response: AxiosResponse<Comment[]> = await APIService.getInstance().get(
        AppConfig.serviceUrls.comments(requestId),
        {
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
                ? SnackMessage.error.fetchCommentsMessage
                : String(error.response?.data?.message || "Unknown error"),
            type: "error",
          }),
        );
        return rejectWithValue(error.response?.data || "Failed to fetch comments");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

export const addComments = createAsyncThunk<Comment, AddCommentPayload, { rejectValue: string }>(
  "comments/addComments",
  async (payload: AddCommentPayload, { dispatch, rejectWithValue }) => {
    try {
      const response: AxiosResponse<Comment> = await APIService.getInstance().post(
        AppConfig.serviceUrls.comments(payload.requestId),
        payload,
      );
      dispatch(
        enqueueSnackbarMessage({
          message: SnackMessage.success.addCommentMessage,
          type: "success",
        }),
      );
      return response.data; // expect created comment
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.status === HttpStatusCode.InternalServerError
          ? SnackMessage.error.addCommentMessage
          : String(error.response?.data?.message || error.message || "Unknown error")
        : "An unexpected error occurred";
      dispatch(enqueueSnackbarMessage({ message, type: "error" }));
      return rejectWithValue(message);
    }
  },
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    resetCommentsState(state) {
      state.state = State.idle;
      state.comments = undefined;
      state.errorMessage = null;
      state.functionType = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.state = State.loading;
        state.functionType = "fetch";
        state.errorMessage = "Fetching comments...";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.state = State.success;
        state.functionType = undefined;
        state.errorMessage = null;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.state = State.failed;
        state.functionType = undefined;
        state.errorMessage = "Failed to fetch comments";
      })
      .addCase(addComments.pending, (state) => {
        state.state = State.loading;
        state.functionType = "create";
        state.errorMessage = "Adding comment...";
      })
      .addCase(addComments.fulfilled, (state) => {
        state.state = State.success;
        state.functionType = undefined;
        state.errorMessage = null;
      })
      .addCase(addComments.rejected, (state) => {
        state.state = State.failed;
        state.functionType = undefined;
        state.errorMessage = "Failed to add comment";
      });
  },
});

export const { resetCommentsState } = commentsSlice.actions;
export default commentsSlice.reducer;
