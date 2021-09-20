import React from "react";
import { connect } from "react-redux";
import "./UserProfile.css";
import { Container } from "../../Container/Container";
import * as MdIcons from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import { setImageUrl } from "../../redux/user";

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
            <div className="Prestaurants-choose__header">
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
                  className="PSearch__text"
                  placeholder="Name"
                  value={props.userData && props.userData.name}
                  id={"search"}
                />
              </div>
              <br />
              <p className="Pidentifiers">Nick name</p>
              <div className="PSearch">
                <input
                  type="text"
                  className="PSearch__text"
                  placeholder="No nickname? Uh Boring.."
                  value={props.userData && props.userData.nickname}
                  id={"search"}
                />
              </div>
              <br />
              <p className="Pidentifiers">Phone number</p>
              <div className="PSearch">
                <input
                  type="number"
                  className="PSearch__text"
                  placeholder="Phone number"
                  value={props.userData && props.userData.number}
                  id={"search"}
                />
              </div>
              <br />
              <p className="Pidentifiers">Date of Birth</p>
              <div className="PSearch">
                <input
                  type="date"
                  className="PSearch__text"
                  placeholder="DOB"
                  value={props.userData && props.userData.date}
                  id={"search"}
                />
              </div>
              <TextField
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
              />
            </div>
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
    setImage: url => dispatch(setImageUrl(url))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
