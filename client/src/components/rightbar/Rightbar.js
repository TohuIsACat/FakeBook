import React, { useContext, useEffect, useRef, useState } from "react";
import "./rightbarStyles/rightbar.css";
import Online from "../online/Online";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PersonAdd, PersonRemove, Edit, Save } from "@mui/icons-material";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

function Rightbar({ user, onlineUsers }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { currentUser, dispatch, socket } = useContext(AuthContext);
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();
  const [gender, setGender] = useState();
  const city = useRef();
  const from = useRef();
  const month = useRef();
  const day = useRef();
  const [relationship, setRelationship] = useState();
  const [birthdayUser, setBirthdayUser] = useState([]);

  // get friend
  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + user._id);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  // birthday
  useEffect(() => {
    const today = new Date();
    const getBirthday = async () => {
      try {
        const res = await axios.get("/users/friends/" + currentUser._id);
        let friendBirthdayList = res.data;
        friendBirthdayList.forEach((item, index, arr) => {
          if (
            (new Date(`${today.getFullYear()}-${item.birthday}`) - today) /
              86400000 <
            0
          ) {
            arr[index].birthday = Math.abs(
              parseInt(
                (new Date(`${today.getFullYear() + 1}-${item.birthday}`) -
                  today) /
                  86400000
              )
            );
          } else {
            arr[index].birthday = Math.abs(
              parseInt(
                (new Date(`${today.getFullYear()}-${item.birthday}`) - today) /
                  86400000
              )
            );
          }
        });
        let minDay = friendBirthdayList[0].birthday;
        for (let i = 0; i < friendBirthdayList.length; i++) {
          if (friendBirthdayList[i].birthday < minDay) {
            minDay = friendBirthdayList[i].birthday;
          }
        }

        for (let j = 0; j < friendBirthdayList.length; j++) {
          if (friendBirthdayList[j].birthday === minDay) {
            setBirthdayUser((prev) => [...prev, friendBirthdayList[j]]);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    getBirthday();
  }, [currentUser]);

  // follow and unFollow
  const handleClick = async () => {
    try {
      if (currentUser.followings.includes(user._id)) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userID: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userID: currentUser._id,
        });
        socket.emit("sendNotification", {
          senderID: currentUser._id,
          receiverID: user._id,
          notificationType: 1,
        });
        await axios.post("/notifications", {
          senderID: currentUser._id,
          receiverID: user._id,
          notificationType: 1,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (e) {
      console.log(e);
    }
    const res = await axios.get("/users?userID=" + currentUser._id);
    localStorage.setItem("currentUser", JSON.stringify(res.data));
  };

  // edit info
  const saveHandler = async () => {
    try {
      await axios.put("/users/" + currentUser._id, {
        userID: currentUser._id,
        birthday:
          month.current.value && day.current.value
            ? `${month.current.value}-${day.current.value}`
            : currentUser.birthday,
        gender: gender ? gender : currentUser.gender,
        from: from.current.value ? from.current.value : currentUser.from,
        city: city.current.value ? city.current.value : currentUser.city,
        relationship: relationship ? relationship : currentUser.relationship,
      });
    } catch (e) {
      console.log(e);
    }
    window.location.reload();
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src={PF + "/gift.png"} alt="" />
          {birthdayUser.length > 1 ? (
            <span className="birthdayText">
              <b>{birthdayUser[0]?.username}</b>
              {" and "}
              <b>{birthdayUser[1]?.username}</b>'s birthday is{" "}
              <b>{birthdayUser[0]?.birthday}</b> days away!
            </span>
          ) : (
            <span className="birthdayText">
              <b>{birthdayUser[0]?.username}</b>'s birthday is{" "}
              <b>{birthdayUser[0]?.birthday}</b> days away!
            </span>
          )}
        </div>

        <img className="rightbarAd" src={PF + "/ad.jpg"} alt="" />

        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {onlineUsers.map((o) => (
            <Online key={o} onlineUserID={o}></Online>
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {currentUser.followings.includes(user._id) ? (
              <PersonRemove />
            ) : (
              <PersonAdd />
            )}
            {currentUser.followings.includes(user._id) ? (
              <span style={{ marginLeft: ".75rem" }}>Unfollow</span>
            ) : (
              <span style={{ marginLeft: ".75rem" }}>Follow</span>
            )}
          </button>
        )}
        <div className="rightbarTitle">
          <h4 className="rightbarTitleText">User information</h4>
          {currentUser._id === user._id &&
            (edit ? (
              <Save className="rightbarTitleIcon" onClick={saveHandler} />
            ) : (
              <Edit
                className="rightbarTitleIcon"
                onClick={() => setEdit(true)}
              />
            ))}
        </div>

        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Birthday:</span>
            {edit ? (
              <>
                <input
                  type="number"
                  min="1"
                  max="12"
                  className="rightbarBirthdayInput"
                  placeholder={"MM"}
                  ref={month}
                ></input>
                <span> - </span>
                <input
                  type="number"
                  min="1"
                  max="31"
                  className="rightbarBirthdayInput"
                  placeholder={"DD"}
                  ref={day}
                ></input>
              </>
            ) : (
              <span className="rightbarInfoValue">{user.birthday}</span>
            )}
          </div>

          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Gender:</span>
            {edit ? (
              <FormControl>
                <RadioGroup
                  row
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                  />
                </RadioGroup>
              </FormControl>
            ) : (
              <span className="rightbarInfoValue">
                {user.gender === 1
                  ? "Female"
                  : user.gender === 2
                  ? "Male"
                  : "Other"}
              </span>
            )}
          </div>

          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            {edit ? (
              <input
                className="rightbarInfoInput"
                placeholder={user.from}
                ref={from}
              ></input>
            ) : (
              <span className="rightbarInfoValue">{user.from}</span>
            )}
          </div>

          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            {edit ? (
              <input
                className="rightbarInfoInput"
                placeholder={user.city}
                ref={city}
              ></input>
            ) : (
              <span className="rightbarInfoValue">{user.city}</span>
            )}
          </div>

          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            {edit ? (
              <FormControl>
                <RadioGroup
                  row
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="Single"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="Married"
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio />}
                    label="Privacy"
                  />
                </RadioGroup>
              </FormControl>
            ) : (
              <span className="rightbarInfoValue">
                {user.relationship === 1
                  ? "Single"
                  : user.relationship === 2
                  ? "Married"
                  : "Privacy"}
              </span>
            )}
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <div
              className="rightbarFollowing"
              onClick={() => navigate("/profile/" + friend.username)}
              key={friend._id}
            >
              <img
                src={PF + friend.profilePicture}
                alt=""
                className="rightbarFollowingImg"
              />
              <span className="rightbarFollowingName">{friend.username}</span>
            </div>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}

export default Rightbar;
