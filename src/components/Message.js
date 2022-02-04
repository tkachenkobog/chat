import React, { useRef, useEffect } from 'react';
import Moment from 'react-moment';

const Message = ({ ms, firstUser }) => {
    const scroll = useRef();
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: 'smooth' });
    }, [ms]);
    return (
        <div
            className={`message_wrapper ${ms.from === firstUser ? 'own' : ''}`}
            ref={scroll}
        >
            <p className={ms.from === firstUser ? 'me' : 'friend'}>
                {ms.media ? <img src={ms.media} alt={ms.text} /> : null}
                {ms.text}
                <br />
                <small>
                    <Moment fromNow>{ms.createdAt.toDate()}</Moment>
                </small>
            </p>
        </div>
    );
};

export default Message;
