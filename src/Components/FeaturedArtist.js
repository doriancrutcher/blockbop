import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Container, Col, Row} from 'react-bootstrap'
import Thumb from '../assets/Thumb.png'

const FeaturedArtist = props => {
const [thumbSize,changeThumbSize]=useState('5vw')

    return (
        <div>
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="https://lh3.googleusercontent.com/pw/ACtC-3fLFkEsGd_SZTTXhKtOOgE6ZdW6YOu4zTJNMct9O5Z_uW-fIVhigWRA9LIidXIUG1uA44tdCypUr7DuF1186rX_QRvGP8aIZ_FG1mnrkWXKHMEyJLt72yfGHxdLrfyZc7bdEK8VfTmfM660CVaAxP0X=w1562-h2082-no?authuser=0" />
                <Card.Body>
                    <Card.Title>DJ BlockBopper 3000</Card.Title>
                    <Card.Text>
                        This Pup is coming at you with the best beats of 2021
    </Card.Text>
                    <Container fluid>
                        <Row>
                        <Col>
                        <Button style={{borderRadius:'8vw'}} variant="primary"><img style={{width:thumbSize}} src={Thumb}></img></Button>
                        </Col>
                        <Col>
                            <Button style={{borderRadius:'8vw',transform:'rotate(180deg)'}} variant="danger"><img style={{width:thumbSize}} src={Thumb}></img></Button>
                        </Col>
                        </Row>
                        <Row>
                          <input placeholder={'Input Near Amount'}></input>  <Button>Send Tip</Button>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </div>
    );
};

FeaturedArtist.propTypes = {

};

export default FeaturedArtist;