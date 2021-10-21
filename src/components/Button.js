import React from 'react';
import { Button as MatUIButton } from '@material-ui/core';

class Button extends React.Component {
    render() {
        const { onClick, label } = this.props

        return (
            <MatUIButton style={ButtonStyle} onClick={onClick} >
                {label}
            </MatUIButton>
        );
    }
}

const ButtonStyle = {
    background: "#191A1A",
    color: '#00ff00',
    border: `1px solid #00ff00 `,
}

export default Button;