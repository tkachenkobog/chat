import React, { useEffect, useState } from 'react';
import { db, auth, storage } from '../firebase';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    Timestamp,
    orderBy,
    setDoc,
    doc,
    getDoc,
    updateDoc,
} from 'firebase/firestore';

import User from '../components/User';

import ChackNorris from '../components/ChackNorris';
import MessageForm from '../components/MessageForm';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import Message from '../components/Message';
const Home = () => {
    const [chat, setChat] = useState('');
    const [users, setUsers] = useState([]);
    const [text, setText] = useState('');
    const [img, setImg] = useState('');
    const [msg, setMsg] = useState([]);
    const [joke, setJoke] = useState('');
    const [search, setSearch] = useState('');
    const firstUser = auth.currentUser.uid;

    useEffect(() => {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', 'not-in', [firstUser]));
        const unsub = onSnapshot(q, (querySnapshot) => {
            let users = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });
            setUsers(users);
        });
        return () => unsub();
    }, []);
    //console.log(users);
    const selected = async (user) => {
        setChat(user);
        console.log(user.ava);
        const secondUser = user.uid;
        const id =
            firstUser > secondUser
                ? `${firstUser + secondUser}`
                : `${secondUser + firstUser}`;
        const messageRef = collection(db, 'messages', id, 'chat');
        const q = query(messageRef, orderBy('createdAt', 'asc'));
        onSnapshot(q, (querySnapshot) => {
            let msgs = [];
            querySnapshot.forEach((doc) => {
                msgs.push(doc.data());
            });
            setMsg(msgs);
        });
        const changer = await getDoc(doc(db, 'lastMsg', id));
        if (changer.data() && changer.data().from !== firstUser) {
            await updateDoc(doc(db, 'lastMsg', id), {
                unread: false,
            });
        }
    };
    //console.log(msg);
    const submit = async (event) => {
        event.preventDefault();
        const secondUser = chat.uid;
        const id =
            firstUser > secondUser
                ? `${firstUser + secondUser}`
                : `${secondUser + firstUser}`;
        let url;
        if (img) {
            const imgRef = ref(
                storage,
                `images/${new Date().getTime()} - ${img.name}`
            );
            const upl = await uploadBytes(imgRef, img);
            const dlUrl = await getDownloadURL(ref(storage, upl.ref.fullPath));
            url = dlUrl;
        }
        await addDoc(collection(db, 'messages', id, 'chat'), {
            text,
            from: firstUser,
            to: secondUser,
            createdAt: Timestamp.fromDate(new Date()),
            media: url || '',
        });
        await setDoc(doc(db, 'lastMsg', id), {
            text,
            from: firstUser,
            to: secondUser,
            createdAt: Timestamp.fromDate(new Date()),
            media: url || '',
            unread: true,
        });
        fetch('https://api.chucknorris.io/jokes/random')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setJoke(data.value);
            });
        setText('');
        //   console.log(submit);
    };
    //const us = users.map((item) => item.name);
    //console.log(msg);

    return (
        <div className="home_container">
            <div className="users_container">
                <div className="search">
                    <input
                        type="text"
                        placeholder="Search..."
                        onChange={(event) => {
                            setSearch(event.target.value);
                        }}
                    />
                </div>
                {users
                    .filter((val) => {
                        if (search == '') {
                            return val;
                        } else if (
                            val.name
                                .toLowerCase()
                                .includes(search.toLowerCase())
                        ) {
                            return val;
                        }
                    })
                    .map((user) => (
                        <User
                            key={user.uid}
                            user={user}
                            selected={selected}
                            firstUser={firstUser}
                            chat={chat}
                        />
                    ))}
            </div>
            <div className="messages_container">
                {chat ? (
                    <>
                        <div className="messages_user">
                            <img src={chat.ava} />
                            <h3>{chat.name}</h3>
                        </div>
                        <div className="messages">
                            {msg.length
                                ? msg.map((ms, i) => (
                                      <Message
                                          key={i}
                                          ms={ms}
                                          firstUser={firstUser}
                                      />
                                  ))
                                : null}
                            <ChackNorris joke={joke} msg={msg} chat={chat} />
                        </div>
                        <MessageForm
                            submit={submit}
                            text={text}
                            setText={setText}
                            setImg={setImg}
                        />
                    </>
                ) : (
                    <h3 className="no_conv">Select somebody)</h3>
                )}
            </div>
        </div>
    );
};

export default Home;
