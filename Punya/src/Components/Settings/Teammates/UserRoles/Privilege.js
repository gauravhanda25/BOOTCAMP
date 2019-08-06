import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';

class Privilege extends React.Component {
    constructor(props) {
        super(props);
        var privilege = {};
        var permissions = []
        this.props.list.map((obj, idx) => {
            privilege[obj.sysname + '-' + obj.id] = obj.value
            permissions.push({ id: obj.id, value: obj.value, name:obj.sysname + '-' + obj.id })
        })
        this.state = JSON.parse(JSON.stringify(privilege));
        this.state.permissions = permissions;
        this.props.onChange(privilege);
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.list !== prevProps.list) {
            var privilege = {};
            var permissions = []
            this.props.list.map((obj, idx) => {
                privilege[obj.sysname + '-' + obj.id] = obj.value
                permissions.push({ id: obj.id, value: obj.value, name:obj.sysname + '-' + obj.id  })
            })
            let state = JSON.parse(JSON.stringify(privilege));
            state.permissions = permissions;

            this.setState(state);
            this.props.onChange(privilege);
        }
    }

    handleInputChange = (event) => {
  		const target = event.target;
      const name = event.target.name;
  		let value = target.value;
  		if(target.type == 'checkbox') {
  				value = (target.checked) ? 1 : 0;
  		}
  		this.setState({[name] : value});
      let permissions = this.state.permissions;
      var privilege = {};
      permissions.map((obj,idx)=> {
        if(name == obj.name){
          permissions[idx].value = value
          privilege[obj.name] = value
        } else {
          privilege[obj.name] = obj.value
        }
      })
      this.props.onChange(privilege);
      this.setState({permissions:permissions})

  	}

    render() {
        return (
            <div>
                {this.props.list.map((obj, idx) => {
                    return (
                        <div className="privileges-row" key={obj.sysname}>
                            <input type="checkbox" className="new-check child_view-patients" name={obj.sysname + '-' + obj.id} checked={(this.state[obj.sysname + '-' + obj.id]) ? 'checked' : false} onChange={this.handleInputChange} /><label className="setting-text" >{this.props.langData[obj.sysname]}</label>
                        </div>
                    )
                })
              }
            </div>
        )
    }
}

export default Privilege;
