import React from 'react';
import Att from './svg/Att';
const MessageForm = ({ submit, text, setText, setImg }) => {
    return (
        <form className="message_form" onSubmit={submit}>
            <label htmlFor="img">
                <Att />
            </label>
            <input
                onChange={(event) => setImg(event.target.files[0])}
                type="file"
                id="img"
                accept="/image"
                style={{ display: 'none' }}
            />
            <div>
                <input
                    type="text"
                    placeholder="write something"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                />
            </div>
            <div>
                <button className="btn">Send</button>
            </div>
        </form>
    );
};

export default MessageForm;
