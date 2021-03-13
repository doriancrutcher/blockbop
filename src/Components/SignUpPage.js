import React from 'react';
import PropTypes from 'prop-types';
import {Container,Row,Col,Card} from 'react-bootstrap'

const SignUpPage = props => {
    return (
<Container>
    <Row className="d-flex justify-content-center" style={{margin:'10px'}}> 
    <Card style={{ width: '18rem' }}>
  <Card.Body>
    <Card.Title>Enter In Your Info</Card.Title>

    <Container>
        <Row className="d-flex justify-content-center" style={{marginTop:'10%'}}><input  placeholder="enter display name" type="text"></input></Row>
        <Row className="d-flex justify-content-center" style={{marginTop:'10%'}}><input  placeholder="enter twitch handle" type="text"></input></Row>
        <Row className="d-flex justify-content-center" style={{marginTop:'10%'}}><input  placeholder="amount of initial listens" type="text"></input></Row>

        
    </Container>

  </Card.Body>
</Card>
    </Row>
</Container>
    );
};

SignUpPage.propTypes = {
    
};

export default SignUpPage;