import React, { useState, useEffect } from 'react';
import * as Icon from './images/Icons.jsx'
import axios from 'axios';

const User = (props) => {
  const [userInfo, setUser] = useState({});

  useEffect(() => {
    axios.get(`/user/${props.user}`)
      .then(({ data }) => {
        setUser(data)
      }
      );
  }, []);
  let { username, city, state, photo, elite, friendCount, reviewCount, photoCount } = userInfo;


  return (
    <div className="user-wrapper">
      <div className="user-display">
        <div className="user-avatar">
          <img className="photo-box-img" alt={username} height="60" width="60" src={photo}></img>
        </div>
        <div className="user-story">
          <div className="username"> {username} </div>
          <div className="location"> {`${city}, ${state}`} </div>
          <div><span className="icon-user-review" style={{ width: '18px', height: '18px' }}> <Icon.friends /> </span> <b className="bold">{friendCount}</b> friends </div>
          <div><span className="icon-user-review" style={{ width: '18px', height: '18px' }}> <Icon.reviewCount /> </span> <b className="bold">{reviewCount}</b> reviews </div>
          <div><span className="icon-user-review" style={{ width: '18px', height: '18px' }}> <Icon.photos /> </span> <b className="bold">{photoCount}</b> photos </div>
          {elite &&
            <div className="elite"> <span>{elite}</span> </div>
          }
        </div>
      </div>
      <ul className="user-interaction">
        <li className="interaction-point"> <div className="arrange-user">
          <div className="interaction-icon"> <Icon.share /></div> <div className="interaction-label interaction-border"> Share Review</div>
        </div></li>
        <li className="interaction-point"> <div className="arrange-user">
          <div className="interaction-icon"> <Icon.embed /></div> <div className="interaction-label interaction-border"> Embed Review</div>
        </div></li>
        <li className="interaction-point"> <div className="arrange-user">
          <div className="interaction-icon"> <Icon.compliment /></div> <div className="interaction-label interaction-border"> Compliment</div>
        </div></li>
        <li className="interaction-point"> <div className="arrange-user">
          <div className="interaction-icon"> <Icon.message /></div> <div className="interaction-label interaction-border"> Send Message</div>
        </div></li>
        <li className="interaction-point"> <div className="arrange-user">
          <div className="interaction-icon"> <Icon.follow /></div> <div className="interaction-label"> Follow {username}</div>
        </div></li>
      </ul>
    </div>
  )
};

export default User;