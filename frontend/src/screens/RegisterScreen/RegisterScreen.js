import React, { useState, useEffect } from 'react'
import MainScreen from '../../components/MainScreen'
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/register-slice';

const RegisterScreen = () => {

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [pic, setPic] = useState("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [picMessage, setPicMessage] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const { loading, userInfo, error } = useSelector(state => state.register)


    useEffect(() => {
        if (userInfo) {
            navigate('/mynotes')
        }
    }, [userInfo, navigate])

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmpassword) {
            setMessage("Passwords do not match");
        } else {
            dispatch(register(name, email, password, pic))
        }
    }

    const postDetails = (pics) => {
        if (!pics) {
            return setPicMessage('Please select an Image');
        }
        setPicMessage(null);
        if (pics.type === 'image/png' || pics.type === 'image/jpeg') {
            const data = new FormData();
            data.append('file', pics)
            data.append('upload_preset', 'notezipper')
            data.append('cloud_name', 'dr0kle13x');
            fetch("https://api.cloudinary.com/v1_1/dr0kle13x/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    console.log(pic);
                }).catch((err) => {
                    console.log(err);
                })
        } else {
            return setPicMessage("Please Select an Image");
        }
    }

    return (
        <MainScreen title="REGISTER">
            <div className="loginContainer">
                {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
                {message && <ErrorMessage variant="danger">{message}</ErrorMessage>}
                {loading && <Loading />}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="name"
                            value={name}
                            placeholder="Enter name"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="true"
                        />
                    </Form.Group>

                    <Form.Group controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmpassword}
                            placeholder="Confirm Password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="true"
                        />
                    </Form.Group>
                    {picMessage && (
                        <ErrorMessage variant="danger">{picMessage}</ErrorMessage>
                    )}
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Profile Picture</Form.Label>
                        <Form.Control
                            onChange={(e) => postDetails(e.target.files[0])}
                            type="file"
                            label="Upload Profile Picture"
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Register
                    </Button>
                </Form>
                <Row className="py-3">
                    <Col>
                        Have an Account ? <Link to="/login">Login</Link>
                    </Col>
                </Row>
            </div>
        </MainScreen>
    )
}

export default RegisterScreen;