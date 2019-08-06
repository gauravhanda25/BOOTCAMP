import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router';
import AppointmentConfigSidebar from './AppointmentConfigSidebar.js';
import AppointmentHeader from './AppointmentHeader.js';
import Services from './Services/Services.js';


class ServicesMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      providerId: undefined,
      mode: 'Services',
      Services: Services
    };
  }

  componentDidMount() {

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }

  openServicePackages = () => {
    import('./ServicesPackages/ServicesPackages.js').then(component => {
      let returnState = {};
      returnState.ServicesPackages = component.default;
      returnState.mode = 'ServicesPackages';
      this.setState(returnState);      
    });
  }

  openCreatePackage = (mode, id) => {
    console.log(mode, id);
    import('./ServicesPackages/CreateEditServicesPackages.js').then(component => {
      let returnState = {};
      returnState.CreateEditServicesPackages = component.default;
      returnState.mode = 'CreateEditServicesPackages';
      returnState.servicePackageId = (id) ? id : undefined;
      returnState.servicePackageMode = (mode) ? mode : undefined;
      this.setState(returnState);      
    });
  }

  openCreateService = (mode, id) => {
    import('./Services/CreateEditServices.js').then(component => {
      let returnState = {};
      returnState.CreateEditServices = component.default;
      returnState.mode = 'CreateEditServices';
      returnState.serviceId = (id) ? id : undefined;
      returnState.serviceMode = (mode) ? mode : undefined;
      this.setState(returnState);      
    });
  }

  openDeleteSchedule = (id) => {
    import('./ProviderSchedule/ProviderScheduleDelete.js').then(component => {
      this.setState({
        ProviderScheduleDelete: component.default,
        showSchedulePop: true,
        showSchedule: false,
        showScheduleDelete: true,
        providerId: id,
      });
    });
  }

  backToProviderSchedule = () => {
    this.setState({
        showSchedulePop: true,
        showSchedule: true,
        showScheduleDelete: false,
        providerId: this.state.providerId,
        providerName : this.state.providerName
    });
  }

  openServices = () => {
    this.setState({mode: "Services"})
  }
  render() {
    const {Services, CreateEditServices, serviceId, ServicesPackages, CreateEditServicesPackages, servicePackageId, servicePackageMode, serviceMode} = this.state;
    return (
      <div id="content">
        <div className="container-fluid content setting-wrapper">
          <AppointmentHeader activeMenuTag={'config'}/>
          <AppointmentConfigSidebar />
          {this.state.mode == 'Services' && <Services createService={this.openCreateService} openServicePackages={this.openServicePackages} />}
          {this.state.mode == 'CreateEditServices' && <CreateEditServices serviceId={serviceId} serviceMode={serviceMode} listServices={() => {this.setState({mode: 'Services'})}}/>}
          {this.state.mode == 'ServicesPackages' && <ServicesPackages openServices={this.openServices} openCreatePackage={this.openCreatePackage}/>}
          {this.state.mode == 'CreateEditServicesPackages' && <CreateEditServicesPackages servicePackageId = {servicePackageId} openServicePackages={this.openServicePackages} mode={servicePackageMode}/>}
        </div>

        <div className={(this.state.showSchedulePop) ? "modalOverlay allFilters" : "modalOverlay allFilters no-display"}>
            <div className="small-popup-outer privider-calender-popup">
                <div className="small-popup-header"><div className="popup-name">Provider Schedule - {this.state.providerName}</div><a onClick={() => {this.setState({showSchedulePop: false, ProviderScheduleView: undefined, ProviderScheduleDelete: undefined})}} className="small-cross">×</a></div>
                <div className="privider-calender-content">
                 
                </div>
            </div>
        </div>

      </div>

    );
  }
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ServicesMain));
