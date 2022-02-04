import React, { useDebugValue, useEffect, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import ava from '../ava2.jpg';
const User = ({ user, selected, firstUser, chat }) => {
    const secondUser = user?.uid;
    const [data, setData] = useState('');

    useEffect(() => {
        const id =
            firstUser > secondUser
                ? `${firstUser + secondUser}`
                : `${secondUser + firstUser}`;
        let unsub = onSnapshot(doc(db, 'lastMsg', id), (doc) => {
            setData(doc.data());
        });
        return () => unsub();
    }, []);
    // console.log(data);
    return (
        <>
            <div
                className={`user_wrapper ${
                    chat.name === user.name && 'selected_user'
                }`}
                onClick={() => selected(user)}
            >
                <div className="user_info">
                    <div className="user_detail">
                        <img
                            src={user.ava || ava}
                            alt="ava"
                            className="avatar"
                        />
                        <h4>{user.name}</h4>
                        {data?.from !== firstUser && data?.unread && (
                            <small className="unread">New</small>
                        )}
                    </div>
                    <div
                        className={`user_status ${
                            user.isOnline ? 'online' : 'offline'
                        } `}
                    ></div>
                </div>
                {data && (
                    <p className="truncate">
                        <strong>
                            {data.from === firstUser ? 'Me:' : 'From:'}
                        </strong>
                        {data.text}
                    </p>
                )}
            </div>
            <div
                onClick={() => selected(user)}
                className={`sm_container ${
                    chat.name === user.name && 'selected_user'
                }`}
            >
                <img
                    src={user.ava || ava}
                    alt="ava"
                    className="avatar sm_screen"
                />
            </div>
        </>
    );
};

export default User;
