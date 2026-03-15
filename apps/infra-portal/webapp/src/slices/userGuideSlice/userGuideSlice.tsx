// Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { createAsyncThunk } from "@reduxjs/toolkit";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";
import { SnackMessage } from "@config/constant";
import axios, { HttpStatusCode } from "axios";

export const fetchMarkdown = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "docs/fetchMarkdown",
  async (url: string, { dispatch, rejectWithValue }) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            dispatch(
              enqueueSnackbarMessage({
                message:
                  response.status === HttpStatusCode.InternalServerError
                    ? SnackMessage.error.fetchUserGuideMessage
                    : `Failed to fetch markdown: ${response.statusText}`,
                type: "error",
              })
            );
            return rejectWithValue(`Failed to fetch markdown: ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        if (axios.isCancel(error)) {
            return rejectWithValue("Request canceled");
        }
        if (axios.isAxiosError(error)) {
            dispatch(
            enqueueSnackbarMessage({
                message:
                error.response?.status === HttpStatusCode.InternalServerError
                    ? SnackMessage.error.fetchUserGuideMessage
                    : String(error.response?.data?.message || "Unknown error"),
                type: "error",
            })
            );
            return rejectWithValue(error.response?.data || "Failed to fetch markdown");
        }
        return rejectWithValue("An unexpected error occurred");
    }
  }
);
