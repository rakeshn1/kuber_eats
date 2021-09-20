import React from "react";
import "./UserProfile.css";
import { Container } from "../../Container/Container";
import * as MdIcons from "react-icons/md";

function UserProfile() {
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
  return (
    <Container>
      <main className="PMain">
        <p className="PMain__city">Your Profile</p>
        <div className="PMain__restaurants-list">
          <div className="PRestaurants-choose">
            <div className="Prestaurants-choose__header">
              <img
                src={
                  "https://uber-eats-mates.herokuapp.com/images/ed032859-05fa-4761-9a4f-ac5fb7d5859a.jpg"
                }
                className="PRestaurants-choose__photo"
                alt={"User1"}
              />
              <input
                type="file"
                accept="image/*"
                // onChange={handleImageUpload}
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
              <h3>Name</h3>
              <div className="PSearch">
                <input
                  type="text"
                  className="PSearch__text"
                  placeholder="Name"
                  id={"search"}
                />
              </div>
              <br />
              <h3>Nick name</h3>
              <div className="PSearch">
                <input
                  type="text"
                  className="PSearch__text"
                  placeholder="No nickname? Uh Boring.."
                  id={"search"}
                />
              </div>
              <br />
              <h3>Phone number</h3>
              <div className="PSearch">
                <input
                  type="number"
                  className="PSearch__text"
                  placeholder="Phone number"
                  id={"search"}
                />
              </div>
              <br />
              <h3>Date of Birth</h3>
              <div className="PSearch">
                <input
                  type="date"
                  className="PSearch__text"
                  placeholder="Search for restaurant or cuisine"
                  id={"search"}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </Container>
  );
}
export default UserProfile;
