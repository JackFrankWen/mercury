import React   from "react";
import {Button} from "antd";
import { Navigate } from "react-router-dom";

function Index(): JSX.Element {
    return (
        <div>
            <h1>💖 Hello World!</h1>
            <p>Welcome to your Electron application.</p>
            <Button type="primary">Button</Button>
        </div>
    );
}

export default Index;