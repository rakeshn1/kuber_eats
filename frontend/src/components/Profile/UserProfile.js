import React from "react";
import { connect } from "react-redux";
import "./UserProfile.css";
import { Container } from "../../Container/Container";
import * as MdIcons from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import { setImageUrl, setUser } from "../../redux/user";
import Allcountries from "../countries.json";

function UserProfile(props) {
  const imageUploader = React.useRef(null);
  // componentDidMount() {
  //     (async () => {
  //         const response = await fetch(
  //             "https://uber-eats-mates.herokuapp.com/api/v1/restaurants"
  //         );
  //         const loadedRestaurants = await response.json();
  //         await this.setState({
  //             restaurants: loadedRestaurants
  //         });
  //     })();
  // }

  async function handleClick(event) {
    try {
      event.preventDefault();
      let updatedData = {
        id: props.userData.id,
        name: event.target.name.value,
        email: event.target.email.value,
        nickname: event.target.nickname.value,
        dob: event.target.dob.value,
        number: event.target.number.value,
        imageUrl: props.userData.imageUrl,
        address: {
          addressLine: event.target.addressLine.value,
          city: event.target.city.value,
          state: event.target.state.value,
          country: event.target.country.value,
          pinCode: event.target.pinCode.value
        }
      };
      const response = await axios({
        method: "put",
        url: "http://localhost:5676/users/update",
        data: updatedData
      });
      if (response.status == 200) {
        Swal.fire("Successfully saved the data", "", "success");
        props.setUser(updatedData);
      } else {
        throw new Error(response.data.msg);
      }
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: e
      });
    }
  }

  const handleImageUpload = async event => {
    try {
      //event.preventDefault();
      const [file] = event.target.files;
      if (file) {
        let bodyFormData = new FormData();
        bodyFormData.append("image", file);
        const response = await axios({
          method: "post",
          url: "http://localhost:5676/users/uploadImage",
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (response.status == 200) {
          props.setImage(response.data.imageUrl);
        } else {
          throw new Error(response.data.msg);
        }
      }
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error:" + e
      });
    }
  };

  return (
    <Container>
      <main className="PMain">
        <p className="PMain__city">Your Profile</p>
        <div className="PMain__restaurants-list">
          <div className="PRestaurants-choose">
            <form
              className="Prestaurants-choose__header"
              onSubmit={handleClick}
            >
              <img
                src={props.userData && props.userData.imageUrl}
                className="PRestaurants-choose__photo"
                alt={"User1"}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={imageUploader}
                value=""
                style={{
                  display: "none"
                }}
              />
              <MdIcons.MdModeEdit
                style={{ height: "30px", width: "50px", cursor: "pointer" }}
                onClick={() => imageUploader.current.click()}
              ></MdIcons.MdModeEdit>
              <br />
              <p className="Pidentifiers">Name</p>
              <div className="PSearch">
                <input
                  type="text"
                  name="name"
                  className="PSearch__text"
                  placeholder="Name"
                  defaultValue={props.userData && props.userData.name}
                  id={"search"}
                />
              </div>
              <br />
              <p className="Pidentifiers">Email</p>
              <div className="PSearch">
                <input
                  type="text"
                  name="email"
                  className="PSearch__text"
                  placeholder="Email"
                  defaultValue={props.userData && props.userData.email}
                  id={"search"}
                />
              </div>
              <br />
              <p className="Pidentifiers">Nick name</p>
              <div className="PSearch">
                <input
                  type="text"
                  name="nickname"
                  className="PSearch__text"
                  placeholder="No nickname? Uh Boring.."
                  defaultValue={props.userData && props.userData.nickname}
                  id={"search"}
                />
              </div>
              <br />
              <p className="Pidentifiers">Phone number</p>
              <div className="PSearch">
                <input
                  type="number"
                  name="number"
                  className="PSearch__text"
                  placeholder="Phone number"
                  defaultValue={props.userData && props.userData.number}
                  id={"search"}
                />
              </div>
              <br />
              <p className="Pidentifiers">Date of Birth</p>
              <div className="PSearch">
                <input
                  type="date"
                  name="dob"
                  className="PSearch__text"
                  placeholder="DOB"
                  defaultValue={props.userData && props.userData.dob}
                  id={"search"}
                />
              </div>
              <br />
              <p className="Pidentifiers">Address:</p>
              <p className="Pidentifiers">Address line</p>
              <div className="PSearch">
                <input
                  type="text"
                  name="addressLine"
                  className="PSearch__text"
                  placeholder="Address Line"
                  defaultValue={
                    props.userData &&
                    props.userData.address &&
                    props.userData.address.addressLine
                  }
                  id={"search"}
                />
              </div>
              <br />
              <p className="Pidentifiers">City</p>
              <div className="PSearch">
                <input
                  type="text"
                  name="city"
                  className="PSearch__text"
                  placeholder="City"
                  defaultValue={
                    props.userData &&
                    props.userData.address &&
                    props.userData.address.city
                  }
                  id={"search"}
                />
              </div>
              <br />
              <p className="Pidentifiers">State</p>
              <div className="PSearch">
                <input
                  type="text"
                  name="state"
                  className="PSearch__text"
                  placeholder="State"
                  defaultValue={
                    props.userData &&
                    props.userData.address &&
                    props.userData.address.state
                  }
                  id={"search"}
                />
              </div>
              <br />
              <p className="Pidentifiers">Country</p>
              <div>
                <select
                  style={{ display: "block" }}
                  name="country"
                  className="PSearch"
                  defaultValue="United States"
                >
                  {Allcountries.countries.map(item => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <br />
              <p className="Pidentifiers">Pincode</p>
              <div className="PSearch">
                <input
                  type="number"
                  name="pinCode"
                  className="PSearch__text"
                  placeholder="Pin Code"
                  defaultValue={
                    props.userData &&
                    props.userData.address &&
                    props.userData.address.pinCode
                  }
                  id={"search"}
                />
              </div>
              <br />
              <div className="Pcontainer-login100-form-btn">
                <button className="Plogin100-form-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </Container>
  );
}

function mapStateToProps(globalState) {
  return {
    userData: globalState.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setImage: url => dispatch(setImageUrl(url)),
    setUser: userData => dispatch(setUser(userData))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
