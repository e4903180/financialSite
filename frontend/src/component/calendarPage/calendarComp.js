import React from 'react';
import { Col, Row } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

function CalendarComp() {

    return (
        <>
            <Row>
                <Col md = {{ span : 8, offset : 3 }} style = {{ width : "50vw", height : "15vh" }}>
                    <FullCalendar
                        plugins={[ dayGridPlugin ]}
                        initialView = "dayGridMonth"
                    />
                </Col>
            </Row>
        </>
    );
}

export default CalendarComp;