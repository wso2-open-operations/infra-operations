// Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APIService } from "@utils/apiService";
import { AppConfig } from "@config/config";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";
import { SnackMessage } from "@config/constant";
import axios, { HttpStatusCode } from "axios";
import { State } from "@utils/types";

export interface Topic {
  topicId: number;
  topicName: string;
}

interface TopicsState {
  state: State;
  functionType?: string;
  topics: Topic[] | undefined;
  errorMessage: string | null;
}

const initialState: TopicsState = {
  state: State.idle,
  topics: undefined,
  errorMessage: null,
};

export interface AddTopicPayload{
  topicName: string;
}

export const fetchTopics = createAsyncThunk<
  Topic[],
  void,
  { rejectValue: string }
>(
  "topics/fetchTopics",
  async (_, { dispatch, rejectWithValue }) => {
    APIService.getCancelToken().cancel();
    const newCancelTokenSource = APIService.updateCancelToken();
    try {
      const response = await APIService.getInstance().get(AppConfig.serviceUrls.topics, {
        cancelToken: newCancelTokenSource.token,
      });
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
                ? SnackMessage.error.fetchTopicsMessage
                : String(error.response?.data?.message || "Unknown error"),
            type: "error",
          })
        );
        return rejectWithValue(error.response?.data || "Failed to fetch topics");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const addTopic = createAsyncThunk<
  void,
  AddTopicPayload,
  { rejectValue: string }
>(
  "topics/addTopics",
  async (payload: AddTopicPayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await APIService.getInstance().post(
        AppConfig.serviceUrls.topics,
        payload
      );
      dispatch(
        enqueueSnackbarMessage({
          message: SnackMessage.success.addTopicMessage,
          type: "success",
        })
      );
      return response.data;
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.status === HttpStatusCode.InternalServerError
          ? SnackMessage.error.addTopicMessage
          : String(error.response?.data?.message || error.message || "Unknown error")
        : "An unexpected error occurred";
      dispatch(enqueueSnackbarMessage({ message, type: "error" }));
      return rejectWithValue(message);
    }
  }
);

export const updateTopic = createAsyncThunk<
  void,
  Topic,
  { rejectValue: string }
>(
  "topics/updateTopic",
  async (payload: Topic, { dispatch, rejectWithValue }) => {
    try {
      const response = await APIService.getInstance().put(
        `${AppConfig.serviceUrls.topics}/${payload.topicId}`,
        payload
      );
      dispatch(
        enqueueSnackbarMessage({
          message: SnackMessage.success.updateTopicMessage,
          type: "success",
        })
      );
      return response.data;
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.status === HttpStatusCode.InternalServerError
          ? SnackMessage.error.updateTopicMessage
          : String(error.response?.data?.message || error.message || "Unknown error")
        : "An unexpected error occurred";
      dispatch(enqueueSnackbarMessage({ message, type: "error" }));
      return rejectWithValue(message);
    }
  }
);

export const deleteTopic = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>(
  "topics/deleteTopic",
  async (topicId: number, { dispatch, rejectWithValue }) => {
    APIService.getCancelToken().cancel();
    try {
      const response = await APIService.getInstance()
        .delete(`${AppConfig.serviceUrls.topics}/${topicId}`);
      dispatch(
        enqueueSnackbarMessage({
          message: SnackMessage.success.deleteTopicMessage,
          type: "success",
        })
      );
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to delete topic";
      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.status === HttpStatusCode.InternalServerError
            ? SnackMessage.error.deleteTopicMessage
            : String(error.response?.data?.message || errorMessage);
      }
      dispatch(
        enqueueSnackbarMessage({
          message: errorMessage,
          type: "error",
        })
      );
      return rejectWithValue(
        axios.isAxiosError(error) ? error.response?.data : errorMessage
      );
    }
  }
);

const topicsSlice = createSlice({
  name: "topics",
  initialState,
  reducers: {
    resetTopicsState(state) {
      state.state = State.idle;
      state.topics = undefined;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.state = State.loading;
        state.functionType = "fetch";
        state.errorMessage = "Fetching topics...";
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.state = State.success;
        state.functionType = undefined;
        state.errorMessage = null;
        state.topics = action.payload;
      })
      .addCase(fetchTopics.rejected, (state) => {
        state.state = State.failed;
        state.functionType = undefined;
        state.errorMessage = "Failed to fetch topics";
      })
      .addCase(addTopic.pending, (state) => {
        state.state = State.loading;
        state.functionType = "create";
        state.errorMessage = "Adding topic...";
      })
      .addCase(addTopic.fulfilled, (state) => {
        state.state = State.success;
        state.functionType = undefined;
        state.errorMessage = null;
      })
      .addCase(addTopic.rejected, (state) => {
        state.state = State.failed;
        state.functionType = undefined;
        state.errorMessage = "Failed to add topic";
      })
      .addCase(updateTopic.pending, (state) => {
        state.state = State.loading;
        state.functionType = "update";
        state.errorMessage = "Updating topic...";
      })
      .addCase(updateTopic.fulfilled, (state) => {
        state.state = State.success;
        state.functionType = undefined;
        state.errorMessage = null;
      })
      .addCase(updateTopic.rejected, (state) => {
        state.state = State.failed;
        state.functionType = undefined;
        state.errorMessage = "Failed to update topic";
      })
      .addCase(deleteTopic.pending, (state) => {
        state.state = State.loading;
        state.functionType = "delete";
        state.errorMessage = "Deleting topic...";
      })
      .addCase(deleteTopic.fulfilled, (state) => {
        state.state = State.success;
        state.functionType = undefined;
        state.errorMessage = null;
      })
      .addCase(deleteTopic.rejected, (state) => {
        state.state = State.failed;
        state.functionType = undefined;
        state.errorMessage = "Failed to delete topic";
      });
  },
});

export const { resetTopicsState } = topicsSlice.actions;
export default topicsSlice.reducer;