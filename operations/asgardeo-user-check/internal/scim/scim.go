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

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

const (
	// searchPath is the external-organization user search endpoint exposed by
	// the scim-operations-service. Only the external org is wired up here —
	// this service has no use for the internal-org endpoint.
	searchPath = "/organizations/external/users/search"

	attrUserName = "userName"
)

// CheckUserExists reports whether a user with the given userName (email)
// exists in the external Asgardeo organization. The caller is responsible for
// validating the format of email before calling, since it is interpolated
// into a SCIM filter expression.
func (c *Client) CheckUserExists(ctx context.Context, email string) (bool, error) {
	reqBody, err := json.Marshal(searchRequest{
		Attributes:   []string{attrUserName},
		Filter:       fmt.Sprintf("userName eq %q", email),
		ItemsPerPage: 1,
	})
	if err != nil {
		return false, fmt.Errorf("scim: encode search request: %w", err)
	}

	raw, err := c.do(ctx, http.MethodPost, searchPath, reqBody)
	if err != nil {
		return false, err
	}

	var result searchResponse
	if err := json.Unmarshal(raw, &result); err != nil {
		return false, fmt.Errorf("scim: decode search response: %w", err)
	}

	return result.TotalResults > 0, nil
}
