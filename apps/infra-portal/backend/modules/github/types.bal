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

# [Configurable] OAuth2 entity application configuration.
type Oauth2Config record {|
    # OAuth2 token endpoint
    string tokenUrl;
    # OAuth2 client ID
    string clientId;
    # OAuth2 client secret
    string clientSecret;
    # OAuth2 scopes
    string scopes;
|};

# Retry config for the REST client.
public type RestRetryConfig record {|
    # Retry count
    int count = RETRY_COUNT;
    # Retry interval
    decimal interval = RETRY_INTERVAL;
    # Retry backOff factor
    float backOffFactor = RETRY_BACKOFF_FACTOR;
    # Retry max interval
    decimal maxWaitInterval = RETRY_MAX_INTERVAL;
|};

# Record to represent a GitHub team.
public type GitHubTeam record {|
    # Team slug
    string slug;
    json...;
|};

# Record to represent the data field in the response.
public type GitHubTeamsData record {|
    # List of GitHub teams
    GitHubTeam[] gitChildTeams;
|};

# Record to represent the full response.
public type GitHubTeamsResponse record {|
    # Data field containing the list of GitHub teams
    GitHubTeamsData data;
|};

# Record to represent Organization plan.
public type GitHubPlan record {|
    # The name of the plan
    string name;
    # The maximum number of seats in the plan
    int? seats = ();
    # The number of private repositories in the plan
    int? privateRepoCount = ();
    # The space in the plan
    int? space = ();
    # The unit of the plan
    string? unit = ();
    json...;
|};

# Record to represent a GitHub team.
public type GitHubOrganization record {|
    # The unique ID of the organization
    int? id;
    # The node ID of the organization
    string? nodeId;
    # The API URL of the organization
    string? htmlUrl;
    # The login name of the organization
    string login;
    # The name of the organization
    string? name;
    # The description of the organization
    string? description;
    # The email of the organization
    string? email;
    # The number of public repositories in the organization
    int? publicRepos;
    # The total number of private repositories in the organization
    int? totalPrivateRepos;
    # The creation date of the organization in ISO 8601 format
    string? createdAt;
    # The last updated date of the organization in ISO 8601 format
    string? updatedAt;
    # The plan type of the organization (e.g., "free", "pro", "enterprise")
    GitHubPlan? plan;
    json...;
|};

# Record to represent the data field in the response.
public type GitHubOrganizationData record {|
    # List of GitHub teams
    GitHubOrganization gitOrganization;
    json...;
|};

# Record to represent the full response.
public type GitHubOrganizationResponse record {|
    # Data field containing the list of GitHub teams
    GitHubOrganizationData data;
    json...;
|};

# Record to represent github label data.
public type LabelData record {
    # Label ID
    string name;
    # Label color
    string color;
    # Label description
    string description;
};

# Result of adding labels.
public type GitLabelResult record {|
    # List of successfully added labels
    string[] successLabels;
    # List of labels that failed to be added
    string[] failedLabels;
|};

# Input for adding labels.
public type AddLabelsInput record {
    # The organization name. The name is not case sensitive.
    string orgName;
    # The name of the repository without the .git extension. The name is not case sensitive.
    string repoName;
    # The labels to add to the repository
    LabelData[] labels;
};

# Record to represent the result of a GitHub operation.
public type gitHubOperationResult record {|
    # Name of the operation (e.g., ADD_TOPICS, ADD_LABELS)
    GitHubOperation operation;
    # Status of the operation (e.g., Sucess, Failure)
    GitHubOperationStatus status;
    # Optional error message if the operation failed
    string errorMessage = "None";
|};

# Record to represent repository creation input.
public type CreateRepoInput record {
    # The organization name. The name is not case sensitive.
    string orgName;
    # Repository name
    string repoName;
    # Pass true to create an initial commit with empty README
    boolean autoInit = true;
    # Pass true to create a private repository
    boolean isPrivate;
    # Repository description
    string repoDescription;
    # Repository homepage
    string repoHomepage?;
    # Pass true to enable issues
    boolean enableIssues;
    # Pass true to enable wiki
    boolean enableWiki = false;
    # license template
    string licenseTemplate = "apache-2.0";
    # gitignore template
    string gitignoreTemplate = "Java";
};

# Create repository input.
public type RepositoryInput record {|
    # The organization name. The name is not case sensitive.
    string orgName;
    # Repository name
    string repoName;
    # Pass true to create an initial commit with empty README
    boolean autoInit = false;
    # Pass true to create a private repository
    boolean isPrivate?;
    # Repository description
    string repoDescription?;
    # Repository homepage
    string repoHomepage?;
    # Pass true to enable issues
    boolean enableIssues?;
    # Pass true to enable wiki
    boolean enableWiki?;
    # license template
    string licenseTemplate?;
    # gitignore template
    string gitignoreTemplate?;
|};

# Common Response of a created entity.
public type IdResponse record {|
    # ID
    int id;
    json...;
|};

# Response of a created release.
public type ReleaseResponse record {|
    *IdResponse;
    json...;
|};

# Record to represent topics input.
public type AddGitTopicsInput record {|
    # The organization name. The name is not case sensitive.
    string orgName;
    # The name of the repository without the .git extension. The name is not case sensitive.
    string repoName;
    # The topics to add to the repository
    string[] topics;
|};

# Response of adding topics.
public type AddGitTopicsResponse record {|
    # The topics of the repository
    string[] names;
|};

# Commit file input.
public type CommitFileInput record {|
    # The account owner of the repository. The name is not case sensitive.
    string owner;
    # The name of the repository without the .git extension. The name is not case sensitive.
    string repoName;
    # File path
    string path;
    # Commit message
    string message;
    # Branch name
    string? branch;
    # Content of the file (base64 encoded)
    string encodedContent;
|};

# Response of a file commit.
public type CommitResponse record {|
    # File content
    Content content;
    json...;
|};

# Content of the committed file.
public type Content record {|
    # URL of the file
    string url;
    json...;
|};

# Record to represent branch protection input.
public type AddBranchProtectionInput record {
    # The organization name. The name is not case sensitive.
    string orgName;
    # The name of the repository without the .git extension. The name is not case sensitive.
    string repoName;
    # The type of branch protection rules to be applied
    string branchProtectionType;
};

# Response of adding branch protection rules.
public type BranchProtectionResponse record {|
    # The name of the branch
    string url;
    json...;
|};

# Record to represent team input.
public type AddTeamInput record {
    # The organization name. The name is not case sensitive.
    string orgName;
    # The name of the repository without the .git extension. The name is not case sensitive.
    string repoName;
    # The name of the team to add to the repository
    Team[] teams;
};

# Record to represent a team.
public type Team record {
    # The slug of the team
    string slug;
    # The permission level for the team (e.g., "admin", "push", "pull")
    string permission;
};

# Structure to store GitHub team addition results.
public type AddTeamsResult record {|
    # List of successfully added teams
    string[] successTeams;
    # List of teams that failed to be added
    string[] failedTeams;
|};

# Map for branch protection types.
public const map<string> branchProtectionMap = {
    "Default": "DEFAULT",
    "Bal Lib Repo": "BALLERINA_LIBRARY"
};

# Enum to represent GitHub operations.
public enum GitHubOperation {
    CREATE_GITHUB_CLIENT,
    FORMAT_TEAMS,
    CREATE_REPO,
    ADD_TOPICS,
    ADD_LABELS,
    ADD_ISSUE_TEMPLATE,
    ADD_PULL_REQUEST_TEMPLATE,
    ADD_BRANCH_PROTECTION,
    ADD_TEAMS
}

# Enum for team formats.
public enum TeamFormats {
    # Internal Committer Team format
    INTERNAL_COMMITTER_FORMAT = "-internal-committers",
    # External Committer Team format
    EXTERNAL_COMMITTER_FORMAT = "-external-committers",
    # Readonly Team format
    READONLY_FORMAT = "-readonly"
};

# Enum to represent the status of a GitHub operation.
public enum GitHubOperationStatus {
    SUCCESS,
    FAILURE,
    PARTIAL_FAILURE
}
