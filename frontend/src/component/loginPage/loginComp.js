import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginComp() {
    const nav = useNavigate()

    function submit(e){
        e.preventDefault()

        nav("/home")
    }

    return (
        <>
            <Row className = 'align-items-center' style = {{ height : "90vh" }}>
                <Col md = {{span : 4, offset : 4}}>
                    <form onSubmit = { submit }>
                        <div className = "form-group" style = {{ padding : "1vh" }}>
                            <label htmlFor = "account">Email</label>
                            <input type = "text" className = "form-control" id = "account" placeholder = "Account" />
                        </div>

                        <div className = "form-group" style = {{ padding : "1vh" }}>
                            <label htmlFor = "password">Password</label>
                            <input type = "password" className = "form-control" id = "password" placeholder = "Password" />
                        </div>
                        
                        <div className = "d-grid">
                            <Button type = "submit" variant = "primary" size = "lg">Login</Button>
                        </div>
                    </form>
                </Col>
            </Row>
        </>
    );
}

export default LoginComp;