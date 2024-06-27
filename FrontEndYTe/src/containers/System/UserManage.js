import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import {
  getALLUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
} from "../../services/userService";
import ModalUser from "./ModalUser";
import ModelEditUser from "./ModelEditUser";
import { emitter } from "../../utils/emitter";
class UserManage extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      arrUser: [],
      isOpenModalUser: false,
      isOpenModalEditUser: false,
      userEdit: {},
    };
  }
  async componentDidMount() {
    await this.getAllUserFromReact();
  }

  getAllUserFromReact = async () => {
    let response = await getALLUsers("ALL");
    if (response && response.errCode === 0) {
      this.setState({
        arrUser: response.users,
      });
    }
  };

  handleAddNewUser = () => {
    this.setState({
      isOpenModalUser: true,
    });
  };
  toggleUserModal = () => {
    this.setState({
      isOpenModalUser: !this.state.isOpenModalUser,
    });
  };
  toggleUserEditModal = () => {
    this.setState({
      isOpenModalEditUser: !this.state.isOpenModalEditUser,
    });
  };
  createNewUser = async (data) => {
    try {
      let response = await createNewUserService(data);

      if (response && response.errCode !== 0) {
        alert(response.message);
      } else {
        await this.getAllUserFromReact();
        this.setState({
          isOpenModalUser: false,
        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleDeleteUser = async (item) => {
    try {
      let res = await deleteUserService(item.id);
      if (res && res.errCode === 0) {
        await this.getAllUserFromReact();
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleEditUser = async (item) => {
    this.setState({
      isOpenModalEditUser: true,
      userEdit: item,
    });
  };

  doEditUser = async (user) => {
    try {
      let response = await editUserService(user);
      if (response && response.errCode === 0) {
        this.setState({
          isOpenModalEditUser: false,
        });
        await this.getAllUserFromReact();
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    let arrUsers = this.state.arrUsers;
    return (
      <div className="users-container">
        <ModalUser
          isOpen={this.state.isOpenModalUser}
          toggleFromParent={this.toggleUserModal}
          createNewUser={this.createNewUser}
        />
        {this.state.isOpenModalEditUser && (
          <ModelEditUser
            isOpen={this.state.isOpenModalEditUser}
            toggleFromParent={this.toggleUserEditModal}
            currentUser={this.state.userEdit}
            editUser={this.doEditUser}
          />
        )}
        <div className="title"> Manage users with thanh </div>
        <div>
          <button
            className=" mx-3 btn btn-success px-3"
            onClick={() => {
              this.handleAddNewUser();
            }}
          >
            {" "}
            Add user{" "}
          </button>
        </div>
        <div className="users-table mt-3 mx-3">
          <table id="customers">
            <tbody>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address</th>
                <th>Active</th>
              </tr>

              {this.state.arrUser.map((user, index) => {
                return (
                  <tr key={index}>
                    <td>{user.email}</td>
                    <td> {user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.address}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        style={{ padding: "0 10px" }}
                        onClick={() => {
                          this.handleEditUser(user);
                        }}
                      >
                        <i className="fas fa-pencil-alt"></i>{" "}
                      </button>

                      <button
                        className="btn btn-success"
                        style={{ padding: "0 10px" }}
                        onClick={() => {
                          this.handleDeleteUser(user);
                        }}
                      >
                        <i className="fas fa-trash"></i>{" "}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
