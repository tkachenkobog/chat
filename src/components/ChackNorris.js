import React from 'react';

const ChackNorris = ({ joke, msg, chat }) => {
    //console.log(msg);

    return (
        <div className="jokes-cont">
            {chat ? <p className="joke-p">{joke} </p> : 'Chack is waiting'}
        </div>
    );
};

export default ChackNorris;
