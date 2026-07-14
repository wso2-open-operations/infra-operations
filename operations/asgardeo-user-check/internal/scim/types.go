// Copyright (c) 2026 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

package scim

// searchRequest mirrors types:UserSearchInput in the scim-operations-service
// Ballerina module. Only the fields needed for an existence check are sent —
// a single minimal attribute and a page size of 1, since the caller only
// needs to know whether a match exists.
type searchRequest struct {
	Attributes   []string `json:"attributes"`
	Filter       string   `json:"filter"`
	ItemsPerPage int      `json:"itemsPerPage"`
}

// searchResponse mirrors scim:UserSearchResult. Only totalResults is read;
// the Resources field (which would carry user PII) is intentionally not
// unmarshaled.
type searchResponse struct {
	TotalResults int `json:"totalResults"`
}
