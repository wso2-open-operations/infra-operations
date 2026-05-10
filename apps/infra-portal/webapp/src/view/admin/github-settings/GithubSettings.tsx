import Box from "@mui/material/Box";

import SectionLabel from "@root/src/component/ui/SectionLabel";

import DefaultTeamTable from "./tables/default-teams/DefaultTeamTable";
import FunctionalLeads from "./tables/functional-leads/FunctionalLeads";
import OrganizationsTable from "./tables/organizations/OrganizationsTable";
import RepositoryTopicsTable from "./tables/repository-topics/RepositoryTopicsTable";

export default function GithubSettings() {
  return (
    <>
      <SectionLabel>Github Settings</SectionLabel>
      <Box
        display={"grid"}
        gap={2}
        sx={{
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr",
            md: "1fr",
            lg: "1fr 1fr 1fr",
          },
          gridTemplateAreas: {
            xs: `"leads" 
                 "orgs" 
                 "topics" 
                 "teams"`,

            sm: `"leads" 
                 "orgs" 
                 "topics" 
                 "teams"`,

            md: `"leads" "orgs"
                 "topics" "teams"`,

            // lg: `"leads orgs"
            //      "topics teams"`,
            lg: `"orgs orgs orgs" 
                 "leads topics teams"`,
          },
        }}
      >
        <DefaultTeamTable gridArea="teams" />
        <FunctionalLeads gridArea="leads" />
        <RepositoryTopicsTable gridArea="topics" />
        <OrganizationsTable gridArea="orgs" />
      </Box>
    </>
  );
}
