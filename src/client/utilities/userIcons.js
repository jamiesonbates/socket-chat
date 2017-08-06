import React from 'react';
import FaUser from 'react-icons/lib/ti/user';

function userIconMaker(users, type) {
  switch(type) {
    case 'FOR_PROFILE':
      let url = users[0].cloudinaryUrl.split('/');

      url = [
        ...url.splice(0, url.indexOf('upload') + 1),
        'g_face,c_fill,r_max,h_300,w_300',
        ...url.splice(url.indexOf('upload') + 1)
      ];

      return (
        <img
          src={url.join('/')}
          className="Profile-image"
        />
      )
    case 'FOR_CHAT':
      let chatUrl;

      if (users[0].cloudinaryUrl) {
        chatUrl = users[0].cloudinaryUrl.split('/');
        chatUrl = [
          ...chatUrl.splice(0, chatUrl.indexOf('upload') + 1),
          'g_face,c_fill,r_max,h_300,w_300',
          ...chatUrl.splice(chatUrl.indexOf('upload') + 1)
        ];
      }

      return users[0].cloudinaryUrl ?
        <img src={chatUrl.join('/')} className="Chat-profile-image" />
      : <div className="UserIcon-chat icon">
          <h3>{users[0].firstName[0]}</h3>
        </div>
    break;

    case 'FOR_CONTACT':
      return (
        <div className="UserIcon-contact icon">
          <h3>{users[0].firstName[0]}</h3>
        </div>
      )
    break;

    case 'FOR_SIDE':
      let icon;

      if (users.length < 2) {
        let url;

        if (users[0].cloudinaryUrl) {
          url = users[0].cloudinaryUrl.split('/');
          url = [
            ...url.splice(0, url.indexOf('upload') + 1),
            'g_face,c_fill,r_max,h_300,w_300',
            ...url.splice(url.indexOf('upload') + 1)
          ];
        }

        icon = users[0].cloudinaryUrl ?
          <img src={url.join('/')} className="Side-profile-image" />
        : <div className="UserIcon-side icon">
            <h3>{users[0].firstName[0]}</h3>
          </div>

      }
      else if (users.length > 4) {
        icon = (
          <div className="UserIcon-standard-container icon">
            {

              users.filter((user, i) => {
                if (i < 4) {
                  return true;
                }
              })
              .map((user, i) => (
                <div key={i} className="UserIcon-standard">
                  <FaUser className="UserIcon-standard-user" />
                </div>
              ))
            }
          </div>
        )
      }
      else if (users.length >= 3){
        icon = (
          <div className="UserIcon-standard-container icon">
            {
              users.map((user, i) =>
                <div key={i} className="UserIcon-standard">
                  <FaUser className="UserIcon-standard-user" />
                </div>
              )
            }
          </div>
        )
      }
      else {
        icon = (
          <div className="UserIcon-standard-container icon">
            {
              users.map((user, i) => {
                let url;

                if (user.cloudinaryUrl) {
                  url = user.cloudinaryUrl.split('/');
                  url = [
                    ...url.splice(0, url.indexOf('upload') + 1),
                    'g_face,c_fill,r_max,h_300,w_300',
                    ...url.splice(url.indexOf('upload') + 1)
                  ];
                }

                return user.cloudinaryUrl ?
                  <img
                    key={i}
                    src={url.join('/')}
                    className={ i === 0 ? "Side-profile-image top" : 'Side-profile-image bottom' }
                  />
                : <div
                    key={i}
                    className={i === 0 ? 'UserIcon-standard top' :'UserIcon-standard bottom'}>
                    <h3>{user.firstName[0]}</h3>
                  </div>
              })
            }
          </div>
        )
      }

      return icon;
  }
}

export default userIconMaker;
