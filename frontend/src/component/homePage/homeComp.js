import React from 'react';
import { Col, Row } from 'react-bootstrap';

function HomeComp() {
    return (
        <>
            <Row>
                <Col md = {{ span : 4 }}>
                    <p>This is home page</p>
                </Col>
            </Row>
        </>
    );
}

export default HomeComp;