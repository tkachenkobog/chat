import React, { useState, useEffect } from 'react';
import ava from '../ava2.jpg';
import Camera from '../components/svg/Camera';
import { storage, db, auth } from '../firebase';
import {
    ref,
    getDownloadURL,
    uploadBytes,
    deleteObject,
} from 'firebase/storage';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import Delete from '../components/svg/Delete';
import { useNavigate } from 'react-router-dom';
const Profile = () => {
    const [pic, setPic] = useState('');
    const [user, setUser] = useState();
    const navigate = useNavigate('');
    function picSetup(event) {
        setPic(event.target.files[0]);
    }
    console.log(pic);
    useEffect(() => {
        getDoc(doc(db, 'users', auth.currentUser.uid)).then((docSnap) => {
            if (docSnap.exists) {
                setUser(docSnap.data());
            }
        });

        if (pic) {
            const uploadPic = async () => {
                const picRef = ref(
                    storage,
                    `ava/${new Date().getTime()} - ${pic.name}`
                );
                try {
                    if (user.avaPath) {
                        await deleteObject(ref(storage, user.avaPath));
                    }
                    const upl = await uploadBytes(picRef, pic);
                    const url = await getDownloadURL(
                        ref(storage, upl.ref.fullPath)
                    );
                    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                        ava: url,
                        avaPath: upl.ref.fullPath,
                    });
                    console.log(url);
                    setPic('');
                    //console.log(upl.ref.fullPath);
                } catch (err) {
                    console.log(err.message);
                }
            };
            uploadPic();
        }
    }, [pic]);
    const deletePic = async () => {
        try {
            const ask = window.confirm('You are shure?');
            if (ask) {
                await deleteObject(ref(storage, user.avaPath));
                await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                    ava: '',
                    avaPath: '',
                });
                navigate('/');
            }
        } catch (err) {
            console.log(err.message);
        }
    };
    return user ? (
        <section className="sec-profile">
            <div className="profile_container">
                <div className="img_container">
                    <img src={user.ava || ava} alt="avat" />
                    <div className="overlay">
                        <div>
                            <label htmlFor="photo">
                                <Camera />
                            </label>
                            {user.ava ? <Delete deletePic={deletePic} /> : null}
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="photo"
                                onChange={picSetup}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="text_container">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <hr />
                <small>Join in {user.createdAt.toDate().toDateString()}</small>
            </div>
        </section>
    ) : null;
};

export default Profile;
