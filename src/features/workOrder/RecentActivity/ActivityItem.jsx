import React, { Component } from "react";
import { Feed } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";

class ActivityItem extends Component {
  renderSummary = activity => {
    switch (activity.type) {
      case "newJob":
        return (
          <div>
            New job by{" "}
            <Feed.User
              as={Link}
              to={{ pathname: "/profile/" + activity.orderedByUid }}
            >
              {activity.orderedBy}
            </Feed.User>{" "}
            job title{" "}
            <Link to={{ pathname: "/jobs/" + activity.jobId }}>
              {activity.title}
            </Link>
          </div>
        );
      case "cancelledJob":
        return (
          <div>
            Job by{" "}
            <Feed.User
              as={Link}
              to={{ pathname: "/profile/" + activity.orderedByUid }}
            >
              {activity.orderedBy}
            </Feed.User>{" "}
            title{" "}
            <Link to={{ pathname: "/jobs/" + activity.jobId }}>
              {activity.title}
            </Link>{" "}
            has been cancelled{" "}
          </div>
        );
      default:
        return;
    }
  };

  render() {
    const { activity } = this.props;

    return (
      <Feed.Event>
        <Feed.Label>
          <img src={activity.photoURL || "/assets/user.png"} alt="user" />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>{this.renderSummary(activity)}</Feed.Summary>
          <Feed.Meta>
            <Feed.Date>
              {formatDistance(
                activity.timestamp && activity.timestamp.toDate(),
                Date.now()
              )}{" "}
              ago
            </Feed.Date>
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    );
  }
}

export default ActivityItem;
