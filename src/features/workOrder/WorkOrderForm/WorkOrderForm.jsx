/*global google*/
import React, { Component } from "react";
import { Segment, Button, Form, Grid, Header, Image } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  createJob,
  updateJob,
  cancelToggle
} from "../../workOrder/WorkList/workOrderActions";
import { reduxForm, Field } from "redux-form";
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";
import DateInput from "../../../app/common/form/DateInput";
import PlaceInput from "../../../app/common/form/PlaceInput";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { withFirestore } from "react-redux-firebase";

const mapState = (state, ownProps) => {
  const jobId = ownProps.match.params.id;
  let job = {};
  //did not work with added to if ( && state.firestore.ordered.workOrders.lenght > 0 )
  if (
    state.firestore.ordered.workOrders &&
    state.firestore.ordered.workOrders.lenght > 0
  ) {
    job =
      state.firestore.ordered.workOrders.filter(job => job.id === jobId)[0] ||
      {};
  }
  return {
    initialValues: job,
    job,
    loading: state.async.loading
  };
};
const actions = {
  createJob,
  updateJob,
  cancelToggle
};
const validate = combineValidators({
  title: isRequired({ message: "The job title is required" }),
  category: isRequired({ message: "Category is required" }),
  address: isRequired({ message: "Please enter street" }),
  description: composeValidators(
    isRequired({ message: "Please enter a description" }),
    hasLengthGreaterThan(4)({
      message: "Description needs to be at least 5 characters"
    })
  )(),
  city: isRequired({ message: "Please enter county or city" }),
  date: isRequired({ message: "Date is required" })
});
const category = [
  { key: "painting", text: "Painting", value: "painting" },
  { key: "home renovation", text: "Home Renovation", value: "home renovation" },
  { key: "cleaning", text: "Cleaning", value: "cleaning" },
  {
    key: "electrical installation",
    text: "Electrical Installation",
    value: "electrical installation"
  },
  { key: "plumbing", text: "Plumbing", value: "plumbing" },
  {
    key: "home appliances repair",
    text: "Home Appliances Repair",
    value: "home appliances repair"
  },
  {
    key: "furniture repair & restoration",
    text: "Furniture Repair & Restoration",
    value: "furniture repair & restoration"
  }
];

class WorkOrderForm extends Component {
  state = {
    cityLatLng: {},
    addressLatLng: {}
  };
  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`workOrders/${match.params.id}`);
  }
  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`workOrders/${match.params.id}`);
  }
  // jobs is pointing to workOrders page
  onFormSubmit = async values => {
    values.addressLatLng = this.state.addressLatLng;
    try {
      if (this.props.initialValues.id) {
        if (Object.keys(values.addressLatLng).length === 0) {
          values.addressLatLng = this.props.job.addressLatLng;
        }
        await this.props.updateJob(values);
        this.props.history.push(`/jobs/${this.props.initialValues.id}`);
      } else {
        let createdJob = await this.props.createJob(values);
        this.props.history.push(`/jobs/${createdJob.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleCitySelect = selectedCity => {
    geocodeByAddress(selectedCity)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          cityLatLng: latlng
        });
      })
      .then(() => {
        this.props.change("city", selectedCity);
      });
  };
  handleAddressSelect = selectedAddress => {
    geocodeByAddress(selectedAddress)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          addressLatLng: latlng
        });
      })
      .then(() => {
        this.props.change("address", selectedAddress);
      });
  };

  render() {
    const {
      invalid,
      submitting,
      pristine,
      job,
      cancelToggle,
      loading
    } = this.props;

    return (
      <Grid>
        <Grid.Column width={16}>
          <Segment>
            <Image
              centered
              src="/assets/formPost.jpg"
              alt="Post a job"
              size="small"
            />
            <Header sub color="blue" content="Job request details" />
            <Form
              onSubmit={this.props.handleSubmit(this.onFormSubmit)}
              autoComplete="off"
            >
              <Field
                name="title"
                component={TextInput}
                placeholder="Give your work order title"
              />
              <Field
                name="category"
                component={SelectInput}
                options={category}
                placeholder="Category of job"
              />
              <Field
                name="description"
                component={TextArea}
                rows={6}
                placeholder="Give more details about job"
              />
              <Header sub color="blue" content="Jobs location details" />
              <Field
                name="city"
                component={PlaceInput}
                options={{ types: ["(cities)"] }}
                onSelect={this.handleCitySelect}
                placeholder="Your Region"
              />
              <Field
                name="address"
                component={PlaceInput}
                options={{
                  location: new google.maps.LatLng(this.state.cityLatLng),
                  radius: 1000,
                  types: ["address"]
                }}
                onSelect={this.handleAddressSelect}
                placeholder="street"
              />
              <Field
                name="date"
                component={DateInput}
                dateFormat="dd LLL yyyy h:mm a"
                placeholder="Date that job request will expired"
              />

              <Button
                loading={loading}
                positive
                type="submit"
                disabled={invalid || submitting || pristine}
              >
                Submit
              </Button>
              {job.id && (
                <Button
                  type="button"
                  color={job.cancelled ? "blue" : "red"}
                  content={job.cancelled ? "Reactive job" : "Cancel job"}
                  onClick={() => cancelToggle(!job.cancelled, job.id)}
                  floated="right"
                />
              )}
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}
export default withFirestore(
  connect(
    mapState,
    actions
  )(
    reduxForm({ form: "workOrderForm", validate, enableReinitialize: true })(
      WorkOrderForm
    )
  )
);
