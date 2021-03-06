import React from "react";
import { Grid, Header, Segment, Card, Image, Tab } from "semantic-ui-react";
import { Link } from "react-router-dom";
import format from "date-fns/format";

const panes = [
  { menuItem: "All active jobs", pane: { key: "allInterestedJobs" } },
  { menuItem: "Past interested jobs", pane: { key: "pastInterestedJobs" } },
  { menuItem: "Recent interested jobs", pane: { key: "recentInterestedJobs" } },
  { menuItem: "Posted jobs", pane: { key: "myPostedJobs" } }
];

const UserProfileWorkOrders = ({
  workOrders,
  workOrdersLoading,
  changeTab
}) => (
  <Grid.Column width={12} stackable="true">
    <Segment attached loading={workOrdersLoading}>
      <Header icon="calendar alternate outline" content="Jobs activity" />
      <Tab
        onTabChange={(e, data) => changeTab(e, data)}
        panes={panes}
        menu={{ attached: false, tabular: false, stackable: true }}
      />
      <br />
      <Card.Group itemsPerRow={6} stackable>
        {workOrders &&
          workOrders.map(job => (
            <Card as={Link} to={`/jobs/${job.id}`} key={job.id} size="tiny">
              {/* <Image
                src={`/assets/categoryImages/${job.category}.webp`}
                size="small"
                alt={job.category}
                centered
              /> */}
              <Header
                as="h4"
                block
                textAlign="center"
                style={{ textTransform: "uppercase", wordSpacing: "0.6em" }}
              >
                {job.category}
              </Header>
              <Header as="h5" textAlign="center">
                {job.title}
              </Header>
              <Card.Content>
                <Card.Meta textAlign="center" id="datePhotosCard">
                  {format(job.date && job.date.toDate(), "dd LLL yyyy")}{" "}
                  {/* <div>{format(job.date && job.date.toDate(), "h:mm a")}</div> */}
                </Card.Meta>
              </Card.Content>
            </Card>
          ))}
      </Card.Group>
    </Segment>
  </Grid.Column>
);

export default UserProfileWorkOrders;
