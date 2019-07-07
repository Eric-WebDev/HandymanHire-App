import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import WorkList from "../WorkList/WorkList";
import WorkOrderForm from "../WorkOrderForm/WorkOrderForm";
import { Button } from "semantic-ui-react";
import cuid from "cuid";
import { connect } from "react-redux";
import { createJob, deleteJob, updateJob } from "../WorkList/workOrderActions";

const mapState = state => ({
  jobs: state.jobs
});
const actions = {
  createJob,
  deleteJob,
  updateJob
};
class Dashboard extends Component {
  state = {
    isOpen: false,
    selectedJob: null
  };
  // handleIsOpenToggle = () => {
  //   this.setState(({ isOpen }) => ({
  //     isOpen: !isOpen
  //   }));
  // };
  handleCreateFormOpen = () => {
    this.setState({
      isOpen: true,
      selectedJob: null
    });
  };
  handleFormCancel = () => {
    this.setState({
      isOpen: false
    });
  };
  handleCreateJob = newJob => {
    newJob.id = cuid();
    newJob.photoURL = "/assets/user.png";
    this.props.createJob(newJob);
    this.setState(({ jobs }) => ({
      isOpen: false
    }));
  };
  handleSelectJob = job => {
    this.setState({
      selectedJob: job,
      isOpen: true
    });
  };

  handleUpdateJobs = updatedJob => {
    this.props.updateJob(updatedJob);
    this.setState(({ jobs }) => ({
      isOpen: false,
      selectedJob: null
    }));
  };
  handleDeleteJob = id => {
    this.props.deleteJob(id);
  };
  render() {
    const { isOpen, selectedJob } = this.state;
    const { jobs } = this.props;
    return (
      <Grid>
        <Grid.Column width={10}>
          <WorkList
            jobs={jobs}
            selectJob={this.handleSelectJob}
            deleteJob={this.handleDeleteJob}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <Button
            onClick={this.handleCreateFormOpen}
            positive
            content="Create project"
          />
          {isOpen && (
            <WorkOrderForm
              //makes form changed when click on diffrent view button
              key={selectedJob ? selectedJob.id : 0}
              updateJob={this.handleUpdateJobs}
              selectedJob={selectedJob}
              createJob={this.handleCreateJob}
              cancelFormOpen={this.handleFormCancel}
            />
          )}
        </Grid.Column>
      </Grid>
    );
  }
}
export default connect(
  mapState,
  actions
)(Dashboard);